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

  /**
   * Boolean to specify whether thrown errors/failed logs should be ignored
   */
  ignoreExceptions: boolean;
}

export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

/**
 * Context type - a string/number/bool/Date, or a nested object of the same
 */
export type ContextKey = string | number | boolean | Date;
export type Context = { [key: string]: ContextKey | Context };

/**
 * Interface representing a minimal Timber log
 */
export interface ITimberLog {
  dt: Date;
  level: LogLevel;
  message: string;
  [key: string]: ContextKey | Context;
}

/**
 * Middleware type, which takes a log, and returns Promise<ITimberLog>
 */
export type Middleware = (log: ITimberLog) => Promise<ITimberLog>;

/**
 * Sync type, which takes a array of logs, and resolves the logs
 */
export type Sync = (logs: ITimberLog[]) => Promise<ITimberLog[]>;
