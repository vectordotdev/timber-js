import nock from "nock";
import { base64Encode } from "@timberio/tools";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Browser, getUserAgent } from "./browser";
import * as pjson from "../package.json";

const { version } = pjson;

/**
 * Create a log with a random string / current date
 */
function getRandomLog(message: string): Partial<ITimberLog> {
  return {
    message
  };
}

describe("browser user-agent tests", () => {
  it("should include version number in user-agent", () => {
    const expectedValue = `timber-js/${version}`;
    const actualValue = getUserAgent();
    expect(actualValue).toEqual(expectedValue);
  });
});

/**
 * set new property btoa in node enviroment to run the tests
 */
const _global: any = global;
_global.btoa = base64Encode;

describe("browser tests", () => {
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
