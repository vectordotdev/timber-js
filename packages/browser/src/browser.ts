import fetch from "cross-fetch";

import { ITimberLog, ITimberOptions } from "@timberio/types";

import { Base } from "@timberio/core";

export class Browser extends Base {
  public constructor(apiKey: string, options?: Partial<ITimberOptions>) {
    super(apiKey, options);

    // TODO - remove this in production... dump out the env for dev!
    console.log("Hello from the browser!");

    // Sync function
    const sync = async (logs: ITimberLog[]): Promise<ITimberLog[]> => {
      // TODO - obviously, this doesn't conform perfectly to the spec
      // yet... dev only!
      await fetch("https://logs.timber.io/frames", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Basic ${btoa(this._apiKey)}`
        },
        body: logs.map(log => `${log.level}: ${log.message}`).join("\n")
      });

      return logs;
    };

    // Set the throttled sync function
    this.setSync(sync);
  }
}
