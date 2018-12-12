import Base from "./base";
import { ITimberLog, LogLevel } from "@timberio/types";
import { Writable, Readable } from "stream";

describe("base class tests", () => {
  it("should initialize with API key", () => {
    const apiKey = "testing";
    const base = new Base(apiKey);

    expect((base as any)._apiKey).toEqual(apiKey);
  });

  it("should throw if a `sync` method is missing", async () => {
    const base = new Base("testing");

    // Expect logging to throw an error, since we're missing a `sync` func
    await expect(base.log("Test")).rejects.toThrowError(/sync/);
  });

  it("should use the preProcess pipeline", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async logs => logs);

    // Pass the log through the `.log()` function and get the result
    const result = await base.log(message);

    // Expect the message to be same
    expect(result.message).toEqual(message);

    // ... but a new `date` should be added
    expect(result.dt).not.toBeUndefined();
  });

  it("should default log count to zero", () => {
    const base = new Base("testing");

    expect(base.logged).toEqual(0);
  });

  it("should default synced count to zero", () => {
    const base = new Base("testing");

    expect(base.synced).toEqual(0);
  });

  it("should increment log count on `.log()`", async () => {
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    void (await base.log("Test"));

    // Logged count should now be 1
    expect(base.logged).toEqual(1);
  });

  it("should sync after 500 ms", async () => {
    const base = new Base("testing");

    // Create a sync function that resolves after 500ms
    base.setSync(async log => {
      return new Promise<ITimberLog[]>(resolve => {
        setTimeout(() => {
          resolve(log);
        }, 500);
      });
    });

    // Fire the log event, and store the pending promise
    const pending = base.log("Test");

    // The log count should be 1
    expect(base.logged).toEqual(1);

    // ... but synced should still be zero
    expect(base.synced).toEqual(0);

    // Await the pending sync
    void (await pending);

    // After 500ms, synced should be now be 1
    expect(base.synced).toEqual(1);
  });

  it("should add a pipeline function", async () => {
    // Fixtures
    const firstMessage = "First message";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Message to replacement with
    const newMessage = "Second message";

    // Add a custom pipeline that replaces `message`
    base.use(async log => {
      return {
        ...log,
        message: newMessage,
      };
    });

    // Get the resulting log
    const result = await base.log(firstMessage);

    // The resulting message should equal the new message
    expect(result.message).toEqual(newMessage);
  });

  it("should remove a pipeline function", async () => {
    const base = new Base("testing");

    // Create a pipeline function
    const customPipeline = async (log: ITimberLog) => log;

    // Add the pipeline
    base.use(customPipeline);

    // Confirm that it exists in the `_pipeline` array
    expect((base as any)._middleware).toContain(customPipeline);

    // Remove the pipeline
    base.remove(customPipeline);

    // Confirm that it has disappeared from the array
    expect((base as any)._middleware).not.toContain(customPipeline);
  });

  it("should throw if other than writable stream is passed as i/o stream.", () => {
    // Fixtures
    const rs = new Readable();
    const base = new Base("testing");

    expect(() => {
      // should throw a TypeError
      base.setWritableStream(rs);
    }).toThrow(TypeError);
  });

  it("should write logs in string format to writable stream if objectMode is not set to true", async () => {
    // Fixtures
    const firstMessage = "First message";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Message to replacement with
    const newMessage = "Second message";

    // Add a custom pipeline that replaces `message`
    base.use(async log => {
      return {
        ...log,
        message: newMessage,
      };
    });

    // create a writable stream to write tranformed logs
    const ws = new Writable();
    ws._write = function(chunk, enc, next) {
      const log = chunk.toString();
      // expect each string log written to stream to have transfored message
      expect(log.includes(newMessage)).toEqual(true);
      next();
    };
    base.setWritableStream(ws);

    await base.log(firstMessage);
    await base.log(firstMessage);
    ws.end();
  });

  it("should write logs in object format to writable stream if objectMode is set to true", async () => {
    // Fixtures
    const firstMessage = "First message";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Message to replacement with
    const newMessage = "Second message";

    // Add a custom pipeline that replaces `message`
    base.use(async log => {
      return {
        ...log,
        message: newMessage,
      };
    });

    // create a writable stream with objectMode set to true
    // to write tranformed logs in object form
    const ws = new Writable({ objectMode: true });
    ws._write = function(chunk, enc, next) {
      // chunk is an object here
      const log = chunk;
      expect(log.message).toEqual(newMessage);
      next();
    };
    base.setWritableStream(ws);

    await base.log(firstMessage);
    await base.log(firstMessage);
    ws.end();
  });

  it("should default to 'info' level logging", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Log
    const log = await base.log(message);

    // Should log at 'info' level
    expect(log.level).toEqual(LogLevel.Info);
  });

  it("should handle 'debug' logging", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Log
    const log = await base.debug(message);

    // Should log at 'debug' level
    expect(log.level).toEqual(LogLevel.Debug);
  });

  it("should handle 'info' logging", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Log
    const log = await base.info(message);

    // Should log at 'info' level
    expect(log.level).toEqual(LogLevel.Info);
  });

  it("should handle 'warn' logging", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Log
    const log = await base.warn(message);

    // Should log at 'info' level
    expect(log.level).toEqual(LogLevel.Warn);
  });

  it("should handle 'error' logging", async () => {
    // Fixtures
    const message = "Test";
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Log
    const log = await base.error(message);

    // Should log at 'info' level
    expect(log.level).toEqual(LogLevel.Error);
  });
});
