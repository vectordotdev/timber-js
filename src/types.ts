/**
 * Interface representing a Timber log
 */
export interface ITimberLog {
  message: string;
  date?: Date;
}

/**
 * Pipeline function type, which takes a log, and returns Promise<ITimberLog>
 */
export type Pipeline = (log: ITimberLog) => Promise<ITimberLog>;
