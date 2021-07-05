import { HTTPRequest } from './request';
import { TaskScheduler } from './scheduler';
import { RequestPriority } from './types';

async function test() {
  const scheduler = new TaskScheduler();
  const request1 = new HTTPRequest(
    'https://breaking-bad-quotes.herokuapp.com/v1/quotes',
    RequestPriority.HIGH,
  );
  const request2 = new HTTPRequest(
    'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
    RequestPriority.LOW,
  );
  const request3 = new HTTPRequest(
    'https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1',
    RequestPriority.NORMAL,
  );
  const request4 = new HTTPRequest(
    'https://www.metaweather.com/api/location/search/?query=Paris',
    RequestPriority.HIGH,
  );

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
