import { ITimberLog } from "./types";

/**
 * Pre-process Timber log, by adding missing but required fields
 *
 * @param {ITimberLog} log - Timber log
 * @returns {Promise<ITimberLog>} - Timber log
 */
export async function preProcess(log: ITimberLog): Promise<ITimberLog> {
  return {
    date: new Date(),
    ...log
  };
}

/**
 * TODO make a real sync pipeline
 *
 * @param {ITimberLog} log - Timber log
 * @returns {Promise<ITimberLog>} - Timber log
 */
export async function sync(log: ITimberLog): Promise<ITimberLog> {
  return new Promise<ITimberLog>(resolve => {
    setTimeout(() => {
      resolve(log);
    }, 500);
  });
}
