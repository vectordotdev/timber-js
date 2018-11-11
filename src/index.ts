import EventEmitter from "events";

import { fromEvent, Observable, Subscription } from "rxjs";
import { bufferTime, filter, map, tap } from "rxjs/operators";

/**
 * Options for instantiating a Timber logger instance
 * @interface
 */
export interface ITimberOptions {
  /**
   *  Minimum interval for syncing logging requests to Timber.io
   *  @abstract
   */
  syncInterval: number;
}

/**
 *  Represents a Timber log entry
 *  @interface
 */
export interface ITimberLog {
  /**
   * Message
   * @abstract
   */
  message: string;

  /**
   * Date timestamp for when the log event was raised
   * @abstract
   */
  date?: Date;
}

/**
 * Default options to use with a new Timber instance
 */
const defaultOptions: ITimberOptions = {
  syncInterval: 1000
};

/**
 * Timber core class for logging to the Timber.io service
 */
class Timber {
  private _event = new EventEmitter();
  private _observable: Observable<ITimberLog[]>;
  private _subscription: Subscription;
  private _options: ITimberOptions;
  private _countLogged = 0;
  private _countSynced = 0;

  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  public constructor(apiKey: string, options: Partial<ITimberOptions> = {}) {
    this._options = { ...defaultOptions, ...options };

    // Some basic error checking...

    // API key
    if (typeof apiKey !== "string" || !apiKey) {
      throw new Error("Cannot init Timber logging. Missing API key.");
    }

    // Sync interval should be >= 500ms
    if (
      typeof this._options.syncInterval !== "number" ||
      this._options.syncInterval < 500
    ) {
      throw new Error("Minimum sync interval is 500ms");
    }

    // Create the RxJS pipeline for handling errors...

    this._observable = this.createObservable().pipe(
      // Increment log count
      tap(() => this._countLogged++),

      // Add timestamp if it doesn't exist on the log entry
      map(log => ({
        date: new Date(),
        ...log
      })),

      // Proceed only when `syncInterval` has passed
      bufferTime(this._options.syncInterval),

      // Filter out any empty logs
      filter(logs => !!logs.length)
    );

    // Subscribe to the observable and process logs
    // TODO - this is entirely for testing right now!
    // TODO - add _real_ logging
    this._subscription = this._observable.subscribe(logs => {
      console.log(`${logs.length} logs`);

      // TODO remove this block-- it's for testing only!
      setTimeout(() => {
        this._countSynced += logs.length;
      }, 2000);
    });
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
   * Creates an RxJS Observable for listening to log events
   *
   * @returns number
   */
  public createObservable() {
    return fromEvent<ITimberLog>(this._event, "log");
  }

  /**
   * Log an entry, to be synced with Timber.io
   *
   * @param log - Log entry
   */
  public log(log: ITimberLog) {
    this._event.emit("log", log);
  }
}

// noinspection JSUnusedGlobalSymbols
export default Timber;
