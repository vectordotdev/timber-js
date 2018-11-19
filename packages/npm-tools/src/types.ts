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

/**
 * Pipeline function for processing logs
 */
export type Pipeline = (log: ITimberLog) => Promise<ITimberLog>;

/**
 * Unpacked type, for drilling into function args
 */
export type Unpacked<T> =
  T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
      T extends Promise<infer U> ? U :
        T;