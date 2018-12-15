import nock from "nock";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Writable } from "stream";
import { Node } from "./node";
import { getUserAgent } from "./helpers";
import { version } from "../package.json";

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

describe("node tests", () => {
  it("should set a User-Agent based on the right version number", () => {
    const expectedValue = `timber-js(node)/${version}`;
    const actualValue = getUserAgent();
    expect(actualValue).toEqual(expectedValue);
  });

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
    const message: string = String(Math.random());
    await expect(node.log(message)).rejects.toThrow();

    done();
  });

  it("should write logs in to writable stream", async () => {
    nock("https://logs.timber.io")
      .post("/frames")
      .reply(201);

    const node = new Node("valid api key");
    const message: string = String(Math.random());

    // create a writable stream to write tranformed logs
    const ws = new Writable({ objectMode: true });
    ws._write = function(chunk, enc, next) {
      expect(chunk.message).toEqual(message);
      next();
    };
    node.writeStream(ws);

    await node.log(message);
    ws.end();
  });
});
