/**
 * Timber library options
 */

export interface ITimberOptions {
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
  $schema: "https://raw.githubusercontent.com/timberio/log-event-json-schema/v4.1.0/schema.json";
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
