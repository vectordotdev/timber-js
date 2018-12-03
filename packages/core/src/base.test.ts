import Base from "./base";
import { ITimberLog } from "@timberio/types";

describe("base class tests", () => {
  it("should initialize with API key", () => {
    const apiKey = "testing";
    const base = new Base(apiKey);

    expect((base as any)._apiKey).toEqual(apiKey);
  });

  it("should throw if a `sync` method is missing", async () => {
    const base = new Base("testing");

    // Basic log
    const log = {
      message: "Test"
    };

    // Expect logging to throw an error, since we're missing a `sync` func
    await expect(base.log(log)).rejects.toThrowError(/sync/);
  });

  it("should use the preProcess pipeline", async () => {
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Basic log
    const log = {
      message: "Test"
    };

    // Pass the log through the `.log()` function and get the result
    const result = await base.log(log);

    // Expect the message to be same
    expect(result.message).toEqual(log.message);

    // ... but a new `date` should be added
    expect(result.date).not.toBeUndefined();
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

    // Basic log
    const log = {
      message: "Test"
    };

    void (await base.log(log));

    // Logged count should now be 1
    expect(base.logged).toEqual(1);
  });

  it("should sync after 500 ms", async () => {
    const base = new Base("testing");

    // Create a sync function that resolves after 500ms
    base.setSync(async log => {
      return new Promise<ITimberLog>(resolve => {
        setTimeout(() => {
          resolve(log);
        }, 500);
      });
    });

    // Basic log
    const log = {
      message: "Test"
    };

    // Fire the log event, and store the pending promise
    const pending = base.log(log);

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
    const base = new Base("testing");

    // Add a mock sync method
    base.setSync(async log => log);

    // Initial log
    const log = {
      message: "First message"
    };

    // Message to replacement with
    const newMessage = "Second message";

    // Add a custom pipeline that replaces `message`
    base.addPipeline(async log => {
      return {
        ...log,
        message: newMessage
      };
    });

    // Get the resulting log
    const result = await base.log(log);

    // The resulting message should equal the new message
    expect(result.message).toEqual(newMessage);
  });

  it("should remove a pipeline function", async () => {
    const base = new Base("testing");

    // Create a pipeline function
    const customPipeline = async (log: ITimberLog) => log;

    // Add the pipeline
    base.addPipeline(customPipeline);

    // Confirm that it exists in the `_pipeline` array
    expect((base as any)._pipeline).toContain(customPipeline);

    // Remove the pipeline
    base.removePipeline(customPipeline);

    // Confirm that it has disappeared from the array
    expect((base as any)._pipeline).not.toContain(customPipeline);
  });
});
