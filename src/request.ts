import { AsyncTask, IHTTPRequest, TaskPriority } from './types';

export class HTTPRequest extends AsyncTask implements IHTTPRequest {
  url: string;
  constructor(url: string, priority: TaskPriority = TaskPriority.NORMAL) {
    super(priority);
    this.url = url;
  }
  async execute() {
    const url = await fetch(this.url);
    return url.json();
  }
}
