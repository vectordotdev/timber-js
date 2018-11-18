/**
 * Options for instantiating a Timber logger instance
 * @interface
 */
export interface ITimberOptions {
  /**
   *  Maximum requests to the Timber.io service at any one time.
   *  Recommended setting for most apps (to avoid excessive network I/O): 10
   *  @abstract
   */
  maxRequests: number;
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
 * Pipeline function for processing logs
 */
export type Pipeline = (log: ITimberLog) => Promise<ITimberLog>;

/**
 * Internal queue type
 */
export interface IQueue<T> {
  /**
   * Value of queue should be an object
   */
  value: T;
  /**
   * Leaf node in queue, representing the next value
   */
  next?: IQueue<T>;
}
