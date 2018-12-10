import { ITimberLog, Middleware, ITimberOptions, Sync } from "@timberio/types";
import { makeBatch, makeThrottle } from "@timberio/tools";

import { preProcess } from "./pipeline";

// Set default options for Timber
const defaultOptions: ITimberOptions = {
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

  // Transform pipeline
  protected _pipeline = [preProcess];

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
   * @param log - Log entry
   * @returns Promise<ILog> - resolves to the transformed log
   */
  public async log(log: ITimberLog): Promise<ITimberLog> {
    // Check that we have a sync function
    if (typeof this._sync !== "function") {
      throw new Error("No Timber logger sync function provided");
    }

    // Increment log count
    this._countLogged++;

    // Pass the log through the middleware pipeline
    const transformedLog = await this._pipeline.reduceRight(
      (fn, log) => fn.then(log),
      Promise.resolve(log)
    );

    // Push the log through the batcher, and sync
    await this._batch(transformedLog);

    // Increment sync count
    this._countSynced++;

    // Return the resulting log
    return transformedLog;
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
    this._pipeline.push(fn);
  }

  /**
   * Remove a function from the pipeline
   *
   * @param fn - Pipeline function
   * @returns void
   */
  public remove(fn: Middleware): void {
    this._pipeline = this._pipeline.filter(p => p !== fn);
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
