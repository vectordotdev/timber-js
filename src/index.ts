import makeThrottle from "./throttle";
import { preProcess, sync } from "./pipeline";

import {
  ICustomPipeline,
  ITimberLog,
  ITimberOptions,
  Pipeline,
  Stage
} from "./types";

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
  private _transformers: Pipeline[] = [preProcess];

  // Sync pipeline
  private _sync: Pipeline[] = [];

  // Custom/user pipeline functions
  private _custom: ICustomPipeline[] = [];

  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  public constructor(apiKey: string, options: Partial<ITimberOptions> = {}) {
    this._options = { ...defaultOptions, ...options };

    // Create a network throttler for syncing with Timber.io
    this._sync.push(makeThrottle(this._options.maxRequests)(sync));
  }

  /**
   * Returns a combined pipeline, of transformers and sync
   *
   * @returns Pipeline[]
   */
  private _getCustomPipeline(stage: Stage): Pipeline[] {
    return this._custom.filter(p => p.stage === stage).map(p => p.fn);
  }
  private get _pipeline(): Pipeline[] {
    return [
      ...this._getCustomPipeline(Stage.BeforeTransform),
      ...this._transformers,
      ...this._getCustomPipeline(Stage.BeforeTransform),
      ...this._sync,
      ...this._getCustomPipeline(Stage.AfterSync)
    ];
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
  public async log(log: ITimberLog): Promise<ITimberLog> {
    // Increment log count
    this._countLogged++;

    // Pass the log through the transform/sync pipeline
    const transformedLog = await this._pipeline.reduceRight(
      (fn, log) => fn.then(log),
      Promise.resolve(log)
    );

    // Increment sync count
    this._countSynced++;

    // Return the resulting log
    return transformedLog;
  }

  /**
   * Add a function to the pipeline
   */
  public addPipeline(fn: Pipeline): boolean;
  public addPipeline(fn: Pipeline, stage: Stage = Stage.BeforeSync): boolean {
    // Return false if the function already exists
    if (this._custom.some(p => p.fn === fn && p.stage === stage)) {
      return false;
    }

    // Push the function to the custom queue
    this._custom.push({ fn, stage });

    // Return true to confirm it was added
    return true;
  }

  /**
   * Remove a function from the pipeline
   */
  public removePipeline(fn: Pipeline): boolean;
  public removePipeline(fn: Pipeline, stage?: Stage): boolean {
    // Get the original length of the custom pipeline, to compare with
    const originalLength = this._custom.length;

    // Filter out a pipeline function (optionally on stage)
    this._custom = this._custom.filter(p =>
      stage ? p.fn === fn && p.stage === stage : p.fn === fn
    );

    // Returns `true` if the lengths differ (i.e. `fn` was removed)
    return originalLength !== this._custom.length;
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
