export enum TaskPriority {
  VERY_HIGH = 2,
  HIGH = 1,
  NORMAL = 0,
  LOW = -1,
  VERY_LOW = -2,
}

export interface IAsyncTask {
  execute: () => Promise<any>;
  priority: TaskPriority;
}

export interface IHTTPRequest extends IAsyncTask {
  url: string;
}

export class AsyncTask implements IAsyncTask {
  priority: TaskPriority;
  constructor(priority: TaskPriority) {
    this.priority = priority;
  }
  async execute() {
    return;
  }

  // comparaison functions
  eq(task: AsyncTask) {
    return this.priority === task.priority;
  }
  gt(task: AsyncTask) {
    return this.priority > task.priority;
  }
  gte(task: AsyncTask) {
    return this.gt(task) || this.eq(task);
  }
  lt(task: AsyncTask) {
    return !this.gte(task);
  }
  lte(task: AsyncTask) {
    return !this.gt(task);
  }
}
