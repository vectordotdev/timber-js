import makeThrottle from "./throttle";

interface ILog {
  message: string;
}

type Pipeline = (log: ILog) => Promise<ILog>;

describe("Throttle tests", () => {
  it("should throttle Promises", async () => {
    // Fixtures
    const max = 2;
    const throttleTime = 20; // ms
    const numberOfPromises = 10;

    // Create the throttle function
    const throttle = makeThrottle<Pipeline>(max);

    // Create the pipeline function to use the throttle
    const pipeline = throttle(
      async log =>
        new Promise<ILog>(resolve => {
          setTimeout(() => {
            resolve(log);
          }, throttleTime);
        })
    );

    // Build the promises
    const promises = [];

    // Start the timer
    const start = process.hrtime();

    for (let i = 0; i < numberOfPromises; i++) {
      promises.push(pipeline({ message: "Hey" }));
    }

    // Await until they've all finished
    await Promise.all(promises);

    // End the timer
    const end = process.hrtime(start)[1] / 1000000;

    // Expect time to have taken (numberOfPromises / max) * throttleTime
    const expectedTime = (numberOfPromises / max) * throttleTime;

    expect(end).toBeGreaterThanOrEqual(expectedTime);
  });

  it("should handle rejections", async () => {
    // Create the throttle function
    const throttle = makeThrottle(5);

    // Error counter
    let errors = 0;

    // Create a throttled function that will throw half the time
    const pipeline = throttle(async log => {
      throw new Error("Thrown inside throttled function!");
    });
  });
});
