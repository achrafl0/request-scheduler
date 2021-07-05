"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const scheduler_1 = require("./scheduler");
const types_1 = require("./types");
async function test() {
    const scheduler = new scheduler_1.TaskScheduler();
    const request1 = new request_1.HTTPRequest('https://breaking-bad-quotes.herokuapp.com/v1/quotes', types_1.RequestPriority.HIGH);
    const request2 = new request_1.HTTPRequest('https://ron-swanson-quotes.herokuapp.com/v2/quotes', types_1.RequestPriority.LOW);
    const request3 = new request_1.HTTPRequest('https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1', types_1.RequestPriority.NORMAL);
    const request4 = new request_1.HTTPRequest('https://www.metaweather.com/api/location/search/?query=Paris', types_1.RequestPriority.HIGH);
    const requests = scheduler.addBatch(request1, request2, request3, request4);
    scheduler.cancel('https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1');
    scheduler.peek();
    requests.forEach((requestPromise, index) => {
        requestPromise.then((res) => {
            console.log(`La requete ${index + 1} vient d'etre executée`);
            console.log(res);
        });
    });
    // Autre manière d'ajouter une task, qui sera plus souvent utilisé
}
test();
