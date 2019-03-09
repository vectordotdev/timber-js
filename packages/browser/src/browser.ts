import fetch from "cross-fetch";

import { ITimberLog, ITimberOptions } from "@timberio/types";
import { Base } from "@timberio/core";

// Awaiting: https://bugs.chromium.org/p/chromium/issues/detail?id=571722
// import { getUserAgent } from "./helpers";

export class Browser extends Base {
  public constructor(
    apiKey: string,
    sourceKey: string,
    options?: Partial<ITimberOptions>,
  ) {
    super(apiKey, sourceKey, options);

    // Sync function
    const sync = async (logs: ITimberLog[]): Promise<ITimberLog[]> => {
      const res = await fetch(
        `${this._options.endpoint}/sources/${this._sourceKey}/frames`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this._apiKey}`,
            // Awaiting: https://bugs.chromium.org/p/chromium/issues/detail?id=571722
            // "User-Agent": getUserAgent()
          },
          body: JSON.stringify(logs),
        },
      );

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
