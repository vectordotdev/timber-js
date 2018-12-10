import nock from "nock";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Node } from "./node";

/**
 * Create a log with a random string / current date
 */
function getRandomLog(message: string): ITimberLog {
  return {
    dt: new Date(),
    level: LogLevel.Info,
    message,
  };
}

describe("node tests", () => {
  it("should echo log if timber sends 20x status code", async done => {
    nock("https://logs.timber.io")
      .post("/frames")
      .reply(201);

    const message: string = String(Math.random());
    const expectedLog = getRandomLog(message);
    const node = new Node("valid api key");
    const echoedLog = await node.log(message);
    expect(echoedLog.message).toEqual(expectedLog.message);

    done();
  });

  it("should throw error if timber sends non 200 status code", async done => {
    nock("https://logs.timber.io")
      .post("/frames")
      .reply(401);

    const node = new Node("invalid api key");
    const message: string = String(Math.random);
    await expect(node.log(message)).rejects.toThrow();

    done();
  });
});
