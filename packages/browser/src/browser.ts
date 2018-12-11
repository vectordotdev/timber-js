import fetch from "cross-fetch";

import { ITimberLog, ITimberOptions } from "@timberio/types";

import { Base } from "@timberio/core";
import * as pjson from "../package.json";

const { version } = pjson;

export function getUserAgent(): string {
  return `timber-js/${version}`;
}

export class Browser extends Base {
  public constructor(apiKey: string, options?: Partial<ITimberOptions>) {
    super(apiKey, options);

    // TODO - remove this in production... dump out the env for dev!
    console.log("Hello from the browser!");

    // Sync function
    const sync = async (logs: ITimberLog[]): Promise<ITimberLog[]> => {
      // TODO - obviously, this doesn't conform perfectly to the spec
      // yet... dev only!
      const res = await fetch(this._options.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Basic ${btoa(this._apiKey)}`,
          "User-Agent": getUserAgent(),
        },
        // body: logs.map(log => `${log.level}: ${log.message}`).join("\n"),
      });

      if (res.ok) {
        return logs;
      }

      /**
       * TODO: if status is 50x throw custom ServerError
       * to be used in retry logic
       */
      throw new Error(res.statusText);
    };

    // Set the throttled sync function
    this.setSync(sync);
  }
}
