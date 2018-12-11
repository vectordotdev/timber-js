import nock from "nock";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Node, getUserAgent } from "./node";
import * as pjson from "../package.json";

const { version } = pjson;

/**
 * Create a log with a random string / current date
 */
function getRandomLog(message: string): Partial<ITimberLog> {
  return {
    dt: new Date(),
    level: LogLevel.Info,
    message
  };
}

describe("node user-agent tests", () => {
  it("should include version number in user-agent", () => {
    const expectedValue = `timber-js/${version}`;
    const actualValue = getUserAgent();
    expect(actualValue).toEqual(expectedValue);
  });
});

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
