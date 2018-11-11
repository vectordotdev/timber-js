import { Observable } from "rxjs";
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
 * Timber core class for logging to the Timber.io service
 */
declare class Timber {
  private _event;
  private _observable;
  private _subscription;
  private _options;
  private _countLogged;
  private _countSynced;
  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  constructor(apiKey: string, options?: Partial<ITimberOptions>);
  /**
   * Number of entries logged
   *
   * @returns number
   */
  readonly logged: number;
  /**
   * Number of log entries synced with Timber.io
   *
   * @returns number
   */
  readonly synced: number;
  /**
   * Creates an RxJS Observable for listening to log events
   *
   * @returns number
   */
  createObservable(): Observable<ITimberLog>;
  /**
   * Log an entry, to be synced with Timber.io
   *
   * @param log - Log entry
   */
  log(log: ITimberLog): void;
}
export default Timber;
