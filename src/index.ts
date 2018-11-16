import makeThrottle from "./throttle";
import { ITimberLog, ITimberOptions, Pipeline } from "./types";
import { preProcess, sync } from "./pipeline";

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
  private _options: ITimberOptions;
  private _countLogged = 0;
  private _countSynced = 0;
  private _pipeline: Pipeline[];

  /**
   * Pre-process Timber log, by adding missing but required fields
   * @param {ITimberLog} log - Timber log
   * @returns {Promise<ITimberLog>} - Timber log
   */

  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  public constructor(apiKey: string, options: Partial<ITimberOptions> = {}) {
    this._options = { ...defaultOptions, ...options };

    // Create a network throttler based on max requests
    const throttle = makeThrottle(this._options.maxRequests);

    // Build the internal pipeline
    this._pipeline = [preProcess, throttle(sync)];
  }

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
  public async log(log: ITimberLog) {
    return this._pipeline.reduceRight(
      (fn, log) => fn.then(log),
      Promise.resolve(log)
    );
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
