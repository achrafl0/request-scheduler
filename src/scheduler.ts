import { HTTPRequest } from './request';
import { RequestPriority, RequestStatus } from './types';

interface HTTPTask<T = any> {
  request: HTTPRequest<T>;
  status: RequestStatus;
  resolve(result: any): void;
  reject(error?: any): void;
}

export class TaskScheduler {
  private _queue: HTTPTask[];

  constructor() {
    this._queue = [];
  }

  public async add<T>(request: HTTPRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskRequest: HTTPTask<T> = {
        request: request,
        resolve,
        reject,
        status: RequestStatus.WAITLIST,
      };
      this._add<T>(taskRequest);
    });
  }

  public addBatch(...requests: HTTPRequest[]) {
    return requests.map(this.add.bind(this));
  }

  public getStatus(url: string): RequestStatus {
    const request = this._findByUrl(url);
    if (request) {
      return request.status;
    }
    return RequestStatus.NONEXISTANT;
  }

  public cancel(url: string): void {
    /*
      Comportement attendu:
      - Si elle était en waitlist : rien ne change
      - Si elle était lance : potentiellement ajouter des

    */
    const request = this._findByUrl(url);
    if (request) {
      request.request.cancel();
      request.status = RequestStatus.CANCELED;
      this._queue.splice(this._queue.indexOf(request), 1);
      setTimeout(this._runNext.bind(this));
    }
  }

  public peek() {
    /* Surtout utile pour le debug */
    return this._queue.map(({ status, request }) => ({ status, url: request.url }));
  }

  public changePriority(url: string, priority: RequestPriority) {
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

  public _findByUrl(url: string): HTTPTask<any> | undefined {
    return this._queue.find((request) => request.request.url === url);
  }

  get _runningRequests() {
    return this._filterByStatus(RequestStatus.RUNNING);
  }
  get _waitlist() {
    return this._filterByStatus(RequestStatus.WAITLIST);
  }

  private _filterByStatus(status: RequestStatus) {
    return this._queue.filter((request) => request.status === status);
  }

  private _add<T>(request: HTTPTask) {
    this._queue.push(request);
    setTimeout(this._runNext.bind(this));
  }

  private _runNext() {
    const requests = this._getNextRequests();
    if (requests.length === 0) {
      return;
    }
    for (const request of requests) {
      request.status = RequestStatus.RUNNING;
    }
    Promise.allSettled(requests.map(this._runRequest.bind(this))).then((resolutions) => {
      resolutions.forEach((resolution, index) => {
        // allSettled garde l'ordre des promises
        if (resolution.status === 'fulfilled') {
          const { resolve } = requests[index];
          resolve(resolution.value);
        } else {
          const { reject } = requests[index];
          reject(resolution.reason);
        }
      });
    });
  }

  private _getNextRequests() {
    if (this._runningRequests.length === 0) {
      const maxWaitingPriority = getMaxPriority(this._waitlist);
      return this._waitlist.filter((request) => request.request.priority === maxWaitingPriority);
    }
    const maxRunningPriority = getMaxPriority(this._runningRequests);
    return this._waitlist.filter((request) => request.request.priority >= maxRunningPriority);
  }

  private async _runRequest<T>(request: HTTPTask<T>) {
    try {
      return await request.request.run();
    } catch (error) {
      // TODO : Ajouter un system de automatic reequeue des failed requests avec une plus petites priorité
      // request.changeStatus(RequestStatus.FAILED);
      throw error;
    } finally {
      request.status = RequestStatus.DONE;
      this._queue.splice(this._queue.indexOf(request), 1);
      this._runNext();
    }
  }
}

const getMaxPriority = (tasks: HTTPTask[]) => {
  return Math.max(...tasks.map((task) => task.request.priority));
};

/*
[] ajouter une task toute seule, l'executer et renvoyer son resultat





*/
