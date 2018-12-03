import { default as Timber } from "../src/node";
import { ITimberLog } from "../packages/core/src";

describe("Node logger tests", () => {
  // Check that there's an API key
  if (!process.env["TIMBER_API_KEY"]) {
    throw new Error("Missing Timber API key");
  }

  it("should log via `NodeLogger`", async () => {
    const log: ITimberLog = {
      message: "Hello from Node2"
    };

    const timber = new Timber(process.env["TIMBER_API_KEY"]!);
    await timber.log(log);
  });
});
