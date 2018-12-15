import fetch from "cross-fetch";

import { ITimberLog, ITimberOptions } from "@timberio/types";
import { Base } from "@timberio/core";

import { getUserAgent } from "./helpers";

export class Browser extends Base {
  public constructor(apiKey: string, options?: Partial<ITimberOptions>) {
    super(apiKey, options);

    // Sync function
    const sync = async (logs: ITimberLog[]): Promise<ITimberLog[]> => {
      const res = await fetch(this._options.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(this._apiKey)}`,
          "User-Agent": getUserAgent()
        },
        body: JSON.stringify(logs)
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
