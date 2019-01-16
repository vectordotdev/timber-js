import { LogEntry } from "winston";
import Transport from "winston-transport";

import { Timber } from "@timberio/node";
import { LogLevel } from "@timberio/types";

export class TimberTransport extends Transport {
  public constructor(private _timber: Timber) {
    super();
  }

  public log(info: LogEntry, cb: Function) {
    // Pass the log to Winston's internal event handlers
    setImmediate(() => {
      this.emit("logged", info);
    });

    // Determine the log level
    let level: LogLevel;

    switch (info.level) {
      case "debug":
        level = LogLevel.Debug;
        break;

      case "warn":
        level = LogLevel.Warn;
        break;

      case "error":
        level = LogLevel.Error;
        break;

      // All other log levels use `Info` by default
      default:
        level = LogLevel.Info;
    }

    // Log out to Timber
    void this._timber.log(info.message, level);

    // Winston callback...
    cb();
  }
}
