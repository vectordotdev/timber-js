import nock from "nock";
import fetch from "cross-fetch";
import { ITimberLog, LogLevel } from "@timberio/types";
import makeBatch from "./batch";
import makeThrottle from "./throttle";

/**
 * Create a log with a random string / current date
 */
function getRandomLog(): ITimberLog {
  return {
    $schema:
      "https://raw.githubusercontent.com/timberio/log-event-json-schema/v4.1.0/schema.json",
    dt: new Date(),
    level: LogLevel.Info,
    message: String(Math.random())
  };
}

/**
 * Returns an `n` sized array of logger functions
 *
 * @param logger - Logger function to pass in `getRandomLog()`
 * @param n - Number of functions to return
 */
function logNumberTimes(logger: Function, n: number): Function[] {
  return [...Array(n).keys()].map(() => logger(getRandomLog()));
}

/**
 * Calculate end time in milliseconds
 * @param start: [number, number] = NodeJS `process.hrtime` start time
 */
function calcEndTime(start: [number, number]): number {
  const end = process.hrtime(start);
  return (end[0] * 1e9 + end[1]) / 1e6;
}

describe("batch tests", () => {
  it("should log warning if buffer size is lower than 5", () => {
    const size = 3;
    const sendTimeout = 1000;
    const expectedWarning =
      "warning: Gracefully fixing bad value of batch size to default 5";
    const warning = jest.spyOn(global.console, "warn");

    const batcher = makeBatch(size, sendTimeout);
    expect(warning).toBeCalledWith(expectedWarning);

    warning.mockRestore();
  });

  it("should log warning if flush timeout is lower than 1000", () => {
    const size = 5;
    const sendTimeout = 999;
    const expectedWarning =
      "warning: Gracefully fixing bad value of timeout to default 1000";
    const warning = jest.spyOn(global.console, "warn");
    jest.spyOn(global.console, "warn");

    const batcher = makeBatch(size, sendTimeout);
    expect(console.warn).toBeCalledWith(expectedWarning);

    warning.mockRestore();
  });

  it("should use default buffer size value 5 when size is passed as undefined", () => {
    const size = undefined;
    const sendTimeout = 1000;
    const warning = jest.spyOn(global.console, "warn");

    const batcher = makeBatch(size, sendTimeout);
    expect(console.warn).toHaveBeenCalledTimes(0);

    warning.mockRestore();
  });

  it("should use default flush timeout value 1000 when passed as undefined", () => {
    const size = 5;
    const sendTimeout = undefined;
    const warning = jest.spyOn(global.console, "warn");

    const batcher = makeBatch(size, sendTimeout);
    expect(console.warn).toHaveBeenCalledTimes(0);

    warning.mockRestore();
  });

  it("should default to size of 5, if size is less than 5", async () => {
    const size = 4;
    const sendTimeout = 1000;

    const batcher = makeBatch(size, sendTimeout);
    const logger = batcher((batch: ITimberLog[]) => {
      expect(batch.length).toEqual(5);
    });

    await Promise.all(logNumberTimes(logger, 5)).catch(e => {
      throw e;
    });
  }, 1100);

  it("should default to timeout of 1 sec, if timeout is less than that", done => {
    const size = 6;
    const sendTimeout = 10;

    const batcher = makeBatch(size, sendTimeout);
    const logger = batcher((batch: ITimberLog[]) => {
      expect([2, 1].includes(batch.length)).toBeTruthy();
      done();
    });

    logger(getRandomLog()).catch(e => {
      throw e;
    });

    setTimeout(() => logger(getRandomLog()), 500);
    setTimeout(() => logger(getRandomLog()), 1001);
  }, 2100);

  it("should flush the batch when batch length is one less than max possible size.", done => {
    const size = 200;
    const sendTimeout = 10;

    const batcher = makeBatch(size, sendTimeout);
    const logger = batcher((batch: ITimberLog[]) => {
      expect([99, 2].includes(batch.length)).toBeTruthy();
      done();
    });

    for (let i = 0; i <= 100; i++) {
      logger(getRandomLog()).catch(e => {
        throw e;
      });
    }
  }, 1100);

  it("should not fire timeout while a send was happening.", async done => {
    nock("http://example.com")
      .get("/")
      .reply(200, new Promise(res => setTimeout(() => res(200), 1003)));

    const called = jest.fn();
    const size = 5;
    const sendTimeout = 10;

    const batcher = makeBatch(size, sendTimeout);
    const logger = batcher(async (batch: ITimberLog[]) => {
      called();
      try {
        await fetch("http://example.com");
      } catch (e) {
        throw e;
      }
    });

    await Promise.all(logNumberTimes(logger, 5)).catch(e => {
      throw e;
    });
    expect(called).toHaveBeenCalledTimes(1);
    nock.restore();
    done();
  });

  it("should handle another log that comes in while it's sending...", async done => {
    nock("http://example.com")
      .get("/")
      .reply(200, new Promise(res => setTimeout(() => res(200), 1003)));

    const called = jest.fn();
    const size = 5;
    const sendTimeout = 10;

    const batcher = makeBatch(size, sendTimeout);
    const logger = batcher(async () => {
      called();
      try {
        await fetch("http://example.com");
      } catch (e) {
        throw e;
      }
    });

    await Promise.all(logNumberTimes(logger, 6)).catch(e => {
      throw e;
    });
    expect(called).toHaveBeenCalledTimes(2);
    nock.restore();
    done();
  });

  it("should play nicely with `throttle`", async () => {
    // Fixtures
    const maxThrottle = 2;
    const throttleResolveAfter = 1000; // ms
    const batchSize = 5;
    const numberOfLogs = 20;

    // Create a throttle that processes 1 pipeline at once
    const throttle = makeThrottle(maxThrottle);

    // Resolve the throttler after 1 second
    const throttler = throttle(async logs => {
      return new Promise(resolve => {
        setTimeout(() => resolve(logs), throttleResolveAfter);
      });
    });

    // Store the throttled promises in an array
    const promises = [];

    // Create a batcher that 'emits' after `batchSize` logs
    const batch = makeBatch(batchSize, 5000);

    // The batcher should be throttled
    const batcher = batch((logs: any) => {
      expect(logs.length).toEqual(batchSize);
      return throttler(logs);
    });

    // Start the timer
    const start = process.hrtime();

    // Fire off a bunch of logs into the batcher
    for (let i = 0; i < numberOfLogs; i++) {
      promises.push(batcher(getRandomLog()));
    }

    // Await batching and throttling
    await Promise.all(promises);

    // Get the time once all promises have been fulfilled
    const end = calcEndTime(start);

    // Expect time to have taken at least this long...
    const expectedTime =
      ((numberOfLogs / batchSize) * throttleResolveAfter) / maxThrottle;

    expect(end).toBeGreaterThanOrEqual(expectedTime);
  });
});
