"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskScheduler = void 0;
const types_1 = require("./types");
class TaskScheduler {
    constructor() {
        this._queue = [];
    }
    async add(request) {
        return new Promise((resolve, reject) => {
            const taskRequest = {
                request: request,
                resolve,
                reject,
                status: types_1.RequestStatus.WAITLIST,
            };
            this._add(taskRequest);
        });
    }
    addBatch(...requests) {
        return requests.map(this.add.bind(this));
    }
    getStatus(url) {
        const request = this._findByUrl(url);
        if (request) {
            return request.status;
        }
        return types_1.RequestStatus.NONEXISTANT;
    }
    cancel(url) {
        /*
          Comportement attendu:
          - Si elle était en waitlist : rien ne change
          - Si elle était lance : potentiellement ajouter des
    
        */
        const request = this._findByUrl(url);
        if (request) {
            request.request.cancel();
            request.status = types_1.RequestStatus.CANCELED;
            this._queue.splice(this._queue.indexOf(request), 1);
            setTimeout(this._runNext.bind(this));
        }
    }
    peek() {
        /* Surtout utile pour le debug */
        return this._queue.map(({ status, request }) => ({ status, url: request.url }));
    }
    changePriority(url, priority) {
        /*
          Comportement attendu :
          - Si une requete était déjà en cours, on ne l'annule pas dans tout les cas
            Si la requete avait la plus grande priorite des taches en cours : on doit rajouter des requetes
            Sinon on doit rien faire, dans tout les cas :
          - Si elle était en waitlist, meme comportement que si on l'annule puis on la rajoute avec la nouvelle
    
        */
        const request = this._findByUrl(url);
        if (request) {
            request.request.changePriority(priority);
            setTimeout(this._runNext.bind(this));
        }
    }
    _findByUrl(url) {
        return this._queue.find((request) => request.request.url === url);
    }
    get _runningRequests() {
        return this._filterByStatus(types_1.RequestStatus.RUNNING);
    }
    get _waitlist() {
        return this._filterByStatus(types_1.RequestStatus.WAITLIST);
    }
    _filterByStatus(status) {
        return this._queue.filter((request) => request.status === status);
    }
    _add(request) {
        this._queue.push(request);
        setTimeout(this._runNext.bind(this));
    }
    _runNext() {
        const requests = this._getNextRequests();
        if (requests.length === 0) {
            return;
        }
        for (const request of requests) {
            request.status = types_1.RequestStatus.RUNNING;
        }
        Promise.allSettled(requests.map(this._runRequest.bind(this))).then((resolutions) => {
            resolutions.forEach((resolution, index) => {
                // allSettled garde l'ordre des promises
                if (resolution.status === 'fulfilled') {
                    const { resolve } = requests[index];
                    resolve(resolution.value);
                }
                else {
                    const { reject } = requests[index];
                    reject(resolution.reason);
                }
            });
        });
    }
    _getNextRequests() {
        if (this._runningRequests.length === 0) {
            const maxWaitingPriority = getMaxPriority(this._waitlist);
            return this._waitlist.filter((request) => request.request.priority === maxWaitingPriority);
        }
        const maxRunningPriority = getMaxPriority(this._runningRequests);
        return this._waitlist.filter((request) => request.request.priority >= maxRunningPriority);
    }
    async _runRequest(request) {
        try {
            return await request.request.run();
        }
        catch (error) {
            // TODO : Ajouter un system de automatic reequeue des failed requests avec une plus petites priorité
            // request.changeStatus(RequestStatus.FAILED);
            throw error;
        }
        finally {
            request.status = types_1.RequestStatus.DONE;
            this._queue.splice(this._queue.indexOf(request), 1);
            this._runNext();
        }
    }
}
exports.TaskScheduler = TaskScheduler;
const getMaxPriority = (tasks) => {
    return Math.max(...tasks.map((task) => task.request.priority));
};
/*
[] ajouter une task toute seule, l'executer et renvoyer son resultat





*/
