import {
  ITimberLog,
  ITimberOptions,
  LogLevel,
  Middleware,
  Sync
} from "@timberio/types";
import { makeBatch, makeThrottle } from "@timberio/tools";

// Types
type Message = string | Error;

// Set default options for Timber
const defaultOptions: ITimberOptions = {
  // Default sync endpoint:
  endpoint: "https://logs.timber.io/frames",

  // Maximum number of logs to sync in a single request to Timber.io
  batchSize: 1000,

  // Max interval (in milliseconds) before a batch of logs proceeds to syncing
  batchInterval: 1000,

  // Maximum number of sync requests to make concurrently
  syncMax: 5
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

  /* PRIVATE METHODS */
  private getContextFromError(e: Error) {
    return {
      stack: e.stack
    };
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
   * @param context: (Pick<ITimberLog, "context">) - Context (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async log(
    message: Message,
    level: LogLevel = LogLevel.Info,
    context: Pick<ITimberLog, "context"> = {}
  ): Promise<ITimberLog> {
    // Check that we have a sync function
    if (typeof this._sync !== "function") {
      throw new Error("No Timber logger sync function provided");
    }

    // Increment log count
    this._countLogged++;

    // Start building the log message
    let log: Partial<ITimberLog> = {
      // Implicit date timestamp
      dt: new Date(),

      // Explicit level
      level,

      // Add initial context
      context
    };

    // Determine the type of message...

    // Is this an error?
    if (message instanceof Error) {
      log = {
        // Add stub
        ...log,

        // Add stack trace
        context: {
          ...log.context,
          ...this.getContextFromError(message)
        },

        // Add error message
        message: message.message
      };
    } else {
      log = {
        // Add stub
        ...log,

        // Add string message
        message
      };
    }

    // Pass the log through the middleware pipeline
    const transformedLog = await this._middleware.reduceRight(
      (fn, pipedLog) => fn.then(pipedLog),
      Promise.resolve(log as ITimberLog)
    );

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
   * @param context: (Pick<ITimberLog, "context">) - Context (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async debug(
    message: Message,
    context?: Pick<ITimberLog, "context">
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Debug, context);
  }

  /**
   *
   * Info level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param context: (Pick<ITimberLog, "context">) - Context (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async info(
    message: Message,
    context?: Pick<ITimberLog, "context">
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Info, context);
  }

  /**
   *
   * Warning level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param context: (Pick<ITimberLog, "context">) - Context (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async warn(
    message: Message,
    context?: Pick<ITimberLog, "context">
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Warn, context);
  }

  /**
   *
   * Warning level log, to be synced with Timber.io
   *
   * @param message: string - Log message
   * @param context: (Pick<ITimberLog, "context">) - Context (optional)
   * @returns Promise<ITimberLog> after syncing
   */
  public async error(
    message: Message,
    context?: Pick<ITimberLog, "context">
  ): Promise<ITimberLog> {
    return this.log(message, LogLevel.Error, context);
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
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
