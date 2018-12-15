import fetch from "cross-fetch";
// import Msgpack from "msgpack5";

import { base64Encode } from "@timberio/tools";
import { ITimberLog, ITimberOptions } from "@timberio/types";
import { Base } from "@timberio/core";

import { getUserAgent } from "./helpers";

// Namespace the msgpack library
// const msgpack = Msgpack();

export class Node extends Base {
  public constructor(apiKey: string, options?: Partial<ITimberOptions>) {
    super(apiKey, options);

    // Sync function
    const sync = async (logs: ITimberLog[]): Promise<ITimberLog[]> => {
      const res = await fetch(this._options.endpoint, {
        method: "POST",
        headers: {
          // "Content-Type": "application/msgpack",
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Encode(this._apiKey)}`,
          "User-Agent": getUserAgent()
        },
        // body: logs.map(log => `${log.level}: ${log.message}`).join("\n")
        // body: msgpack.encode(logsWithSchema).slice()

        // TODO - using JSON for now; switch to msgpack later
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

  public writeStream(ws: any) {
    this.setWritableStream(ws);
  }
}
