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

    const { level, message, ...meta } = info;

    // Determine the log level
    let logLevel: LogLevel;

    switch (level) {
      case "debug":
        logLevel = LogLevel.Debug;
        break;

      case "warn":
        logLevel = LogLevel.Warn;
        break;

      case "error":
        logLevel = LogLevel.Error;
        break;

      // All other log levels use `Info` by default
      default:
        logLevel = LogLevel.Info;
    }

    // Log out to Timber
    void this._timber.log(message, logLevel, meta);

    // Winston callback...
    cb();
  }
}
