import fetch from "cross-fetch";

import { makeThrottle } from "@timberio/tools";
import { ITimberLog, Pipeline } from "@timberio/types";

import { Base } from "@timberio/core";

export class Browser extends Base {
  public constructor(apiKey: string) {
    super(apiKey);

    // TODO - remove this in production... dump out the env for dev!
    console.log("Hello from the browser!");

    // Create a sync throttler
    const throttler = makeThrottle<Pipeline>(5);

    // Sync function
    const sync = async (log: ITimberLog): Promise<ITimberLog> => {
      // TODO - obviously, this doesn't conform perfectly to the spec
      // yet... dev only!
      await fetch("https://logs.timber.io/frames", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Basic ${btoa(this._apiKey)}`
        },
        body: `debug: ${log.message}`
      });

      return log;
    };

    // Set the throttled sync function
    this.setSync(throttler(sync));
  }
}
