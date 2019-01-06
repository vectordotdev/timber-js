/**
 * Timber library options
 */

export interface ITimberOptions {
  /**
   * Endpoint URL for syncing logs with Timber.io
   */
  endpoint: string;

  /**
   * Maximum number of logs to sync in a single request to Timber.io
   */
  batchSize: number;

  /**
   * Max interval (in milliseconds) before a batch of logs proceeds to syncing
   */
  batchInterval: number;

  /**
   * Maximum number of sync requests to make concurrently (useful to limit
   * network I/O)
   */
  syncMax: number;
}

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error"
}

/**
 * Interface representing a Timber log
 */
export interface ITimberLog {
  dt: Date;
  level: LogLevel;
  message: string;
  context?: object;
}

/**
 * Middleware type, which takes a log, and returns Promise<ITimberLog>
 */
export type Middleware = (log: ITimberLog) => Promise<ITimberLog>;

/**
 * Sync type, which takes a array of logs, and resolves the logs
 */
export type Sync = (logs: ITimberLog[]) => Promise<ITimberLog[]>;
