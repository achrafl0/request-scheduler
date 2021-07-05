import { RequestPriority } from './types';
import fetch from 'node-fetch';

export class HTTPRequest<T = any> {
  url: string;
  abortController: AbortController;
  priority: RequestPriority;

  constructor(url: string, priority: RequestPriority = RequestPriority.NORMAL) {
    this.priority = priority;
    this.url = url;
    this.abortController = new AbortController();
  }

  async run() {
    return fetch(this.url, {
      method: 'get',
      signal: this.abortController.signal,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>;
    });
  }

  cancel() {
    this.abortController.abort();
  }

  changePriority(priority: RequestPriority) {
    this.priority = priority;
  }
}
