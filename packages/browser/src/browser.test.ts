import nock from "nock";
import { base64Encode } from "@timberio/tools";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Browser } from "./browser";

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

/**
 * set new property btoa in node enviroment to run the tests
 */
const _global: any = global;
_global.btoa = base64Encode;

describe("node tests", () => {
  it("should echo log if timber sends 20x status code", async done => {
    nock("https://logs.timber.io")
      .post("/frames")
      .reply(201);

    const message: string = String(Math.random());
    const expectedLog = getRandomLog(message);
    const browser = new Browser("valid api key");
    const echoedLog = await browser.log(message);
    expect(echoedLog.message).toEqual(expectedLog.message);

    done();
  });

  it("should throw error if timber sends non 200 status code", async done => {
    nock("https://logs.timber.io")
      .post("/frames")
      .reply(401);

    const browser = new Browser("invalid api key");
    const message: string = String(Math.random);
    await expect(browser.log(message)).rejects.toThrow();

    done();
  });
});
