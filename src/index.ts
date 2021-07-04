import { HTTPRequest } from './request';
import { TaskPriority } from './types';

const requestOne = new HTTPRequest('', TaskPriority.HIGH);
const requestTwo = new HTTPRequest('', TaskPriority.NORMAL);

console.log(requestOne.lt(requestTwo));
