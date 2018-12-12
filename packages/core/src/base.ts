import {
  ITimberLog,
  ITimberOptions,
  LogLevel,
  Middleware,
  Sync,
} from "@timberio/types";
import { makeBatch, makeThrottle } from "@timberio/tools";
import isStream from "is-stream";

// Set default options for Timber
const defaultOptions: ITimberOptions = {
  // Maximum number of logs to sync in a single request to Timber.io
  batchSize: 1000,

  // Max interval (in milliseconds) before a batch of logs proceeds to syncing
  batchInterval: 1000,

  // Maximum number of sync requests to make concurrently
  syncMax: 5,
};

/**
 * Timber core class for logging to the Timber.io service
 */
class Timber {
  // Timber API key
  protected _apiKey: string;

  // Timber library options
  protected _options: ITimberOptions;

  // Batch function
  protected _batch: any;

  // Middleware
  protected _middleware: Middleware[] = [];

  // Sync function
  protected _sync?: Sync;

  // Number of logs logged
  private _countLogged = 0;

  // Number of logs successfully synced with Timber
  private _countSynced = 0;

  // i/o writable stream to write logs to
  private _writableStream?: any;

  /* CONSTRUCTOR */

  /**
   * Initializes a new Timber instance
   *
   * @param apiKey: string - Private API key for logging to Timber.io
   * @param options?: ITimberOptions - Optionally specify Timber options
   */
  public constructor(apiKey: string, options?: Partial<ITimberOptions>) {
    // First, check we have a valid API key
    if (typeof apiKey !== "string" || apiKey === "") {
      throw new Error("Timber API key missing");
    }

    // Store the API key, to use for syncing with Timber.io
    this._apiKey = apiKey;

    // Merge default and user options
    this._options = { ...defaultOptions, ...options };

    // Create a throttler, for sync operations
    const throttle = makeThrottle(this._options.syncMax);

    // Sync after throttling
    const throttler = throttle((logs: any) => {
      return this._sync!(logs);
    });

    // Create a batcher, for aggregating logs by buffer size/interval
    const batcher = makeBatch(
      this._options.batchSize,
      this._options.batchInterval
    );

    this._batch = batcher((logs: any) => {
      return throttler(logs);
    });
  }

  /* PUBLIC METHODS */

  /**
   * Number of entries logged
   *
   * @returns number
   */
  public get logged(): number {
    return this._countLogged;
  }

  /**
   * Number of log entries synced with Timber.io
   *
   * @returns number
   */
  public get synced(): number {
    return this._countSynced;
  }

  /**
   * Log an entry, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param level (LogLevel) - Level to log at (debug|info|warn|error)
   * @param log: (Partial<ITimberLog>) - Initial log (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async log(
    message: string,
    level: LogLevel = LogLevel.Info,
    log: Partial<ITimberLog> = {}
  ): Promise<ITimberLog> {
    // Check that we have a sync function
    if (typeof this._sync !== "function") {
      throw new Error("No Timber logger sync function provided");
    }

    // Increment log count
    this._countLogged++;

    // Build the initial log
    const initialLog: ITimberLog = {
      dt: new Date(),
      level,
      message,
      ...log,
    };

    // Pass the log through the middleware pipeline
    const transformedLog = await this._middleware.reduceRight(
      (fn, pipedLog) => fn.then(pipedLog),
      Promise.resolve(initialLog)
    );

    // write transformed logs to i/o write stream if present
    if (this._writableStream) {
      // check if the stream is in object mode
      // if so write object else write JSON
      const inObjectMode: boolean = this._writableStream._writableState
        .objectMode;
      this._writableStream.write(
        inObjectMode ? transformedLog : JSON.stringify(transformedLog)
      );
    }

    // Push the log through the batcher, and sync
    await this._batch(transformedLog);

    // Increment sync count
    this._countSynced++;

    // Return the resulting log
    return transformedLog;
  }

  /**
   *
   * Debug level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param log: (Partial<ITimberLog>) - Initial log (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async debug(
    message: string,
    log: Partial<ITimberLog> = {}
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Debug, log);
  }

  /**
   *
   * Info level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param log: (Partial<ITimberLog>) - Initial log (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async info(
    message: string,
    log: Partial<ITimberLog> = {}
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Info, log);
  }

  /**
   *
   * Warning level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param log: (Partial<ITimberLog>) - Initial log (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async warn(
    message: string,
    log: Partial<ITimberLog> = {}
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Warn, log);
  }

  /**
   *
   * Warning level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param log: (Partial<ITimberLog>) - Initial log (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async error(
    message: string,
    log: Partial<ITimberLog> = {}
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Error, log);
  }

  /**
   * Sets the sync method - i.e. the final step in the pipeline to get logs
   * over to Timber.io
   *
   * @param fn - Pipeline function to use as sync method
   */
  public setSync(fn: Sync): void {
    this._sync = fn;
  }

  /**
   * Add a middleware function to the logging pipeline
   *
   * @param fn - Function to add to the log pipeline
   * @returns void
   */
  public use(fn: Middleware): void {
    this._middleware.push(fn);
  }

  /**
   * Remove a function from the pipeline
   *
   * @param fn - Pipeline function
   * @returns void
   */
  public remove(fn: Middleware): void {
    this._middleware = this._middleware.filter(p => p !== fn);
  }

  /**
   * sets the i/o write steram
   *
   * @param ws - i/o write stream
   * @returns void
   */
  public setWritableStream(ws: any): void {
    // use `is-stream` because `@types/node` does not include
    // type for `_writableState`
    if (!isStream.writable(ws)) {
      throw new TypeError("Not a writable stream.");
    }
    this._writableStream = ws;
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
