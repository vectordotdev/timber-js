import Logger from "./base";
import { ITimberLog, ITimberOptions } from "./types";

export default class UniversalLogger extends Logger {
  public constructor(apiKey: string, opt: Partial<ITimberOptions> = {}) {
    super(apiKey, opt);

    // TODO - Set a universal sync method. This is a dummy for dev!
    this._sync = async (log: ITimberLog) => {
      return new Promise<ITimberLog>(resolve => {
        setImmediate(() => resolve(log));
      });
    };
  }
}
