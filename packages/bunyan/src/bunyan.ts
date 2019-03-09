import { Writable } from "stream";

import { Timber } from "@timberio/node";
import { Context, LogLevel } from "@timberio/types";

import { getLogLevel } from "./helpers";

export class TimberStream extends Writable {
  public constructor(private _timber: Timber) {
    super();
  }

  public _write(chunk: any, encoding: any, next: any) {
    // Sanity check for the format of the log
    const jsonString = chunk.toString();

    let log;

    // Should be JSON parsable
    try {
      log = JSON.parse(jsonString);
    } catch (e) {
      return next(e);
    }

    // Log should have string `msg` key, > 0 length
    if (typeof log.msg !== "string" || !log.msg.length) {
      return next();
    }

    // Logging meta data
    const meta: Context = {};

    // Copy `time` if set
    if (typeof log.time === "string" || log.time.length) {
      const time = new Date(log.time);
      if (!isNaN(time.valueOf())) {
        meta.dt = time;
      }
    }

    // Determine the log level
    let level: LogLevel;

    try {
      level = getLogLevel(log.level);
    } catch (_) {
      return next();
    }

    // Log to Timber
    void this._timber.log(log.msg, level, meta);

    next();
  }
}
