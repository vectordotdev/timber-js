import { preProcess } from "./pipeline";
import { ITimberLog, ITimberOptions, Pipeline } from "./types";

/**
 * Default options to use with a new Timber instance
 */
const defaultOptions: ITimberOptions = {
  maxRequests: 10
};

/**
 * Timber core class for logging to the Timber.io service
 */
class Timber {
  // Timber options
  private _options: ITimberOptions;

  // Number of logs logged
  private _countLogged = 0;

  // Number of logs successfully synced with Timber
  private _countSynced = 0;

  // Transform pipeline
  protected _pipeline = [preProcess];

  // Sync function
  protected _sync?: Pipeline;

  /* CONSTRUCTOR */

  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  public constructor(apiKey: string, options: Partial<ITimberOptions> = {}) {
    this._options = { ...defaultOptions, ...options };
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

    // Pass the log through the transform/sync pipeline
    const transformedLog = await this._pipeline
      .concat(this._sync)
      .reduceRight((fn, log) => fn.then(log), Promise.resolve(log));

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
  public setSync(fn: Pipeline): void {
    this._sync = fn;
  }

  /**
   * Add a function to the pipeline
   *
   * @param fn - Function to add to the log pipeline
   * @returns void
   */
  public addPipeline(fn: Pipeline): void {
    this._pipeline.push(fn);
  }

  /**
   * Remove a function from the pipeline
   *
   * @param fn - Pipeline function
   * @returns void
   */
  public removePipeline(fn: Pipeline): void {
    this._pipeline = this._pipeline.filter(p => p !== fn);
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
