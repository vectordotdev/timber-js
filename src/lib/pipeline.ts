import { ITimberLog } from "./types";

/**
 * Pre-process Timber log, by adding missing/required fields
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
