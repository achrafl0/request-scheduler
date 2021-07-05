export enum RequestPriority {
  VERY_HIGH = 2,
  HIGH = 1,
  NORMAL = 0,
  LOW = -1,
  VERY_LOW = -2,
}

export enum RequestStatus {
  WAITLIST = 'waitlist',
  RUNNING = 'running',
  DONE = 'done',
  IDLE = 'idle',
  CANCELED = 'canceled',
  FAILED = 'failed',
  NONEXISTANT = "non-existant"
}
