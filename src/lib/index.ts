import fetch from "cross-fetch";

import Base from "./base";

class Logger extends Base {
  public constructor(apiKey: string) {
    super(apiKey);

    if (typeof window === "undefined") {
      console.log("SHOULD NEVER GET HERE");
    }
  }
}

export default Logger;
