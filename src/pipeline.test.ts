import { preProcess } from "./pipeline";

test("preProcess should add missing date", async () => {
  // Sample log, minus the date
  const log = {
    message: "Test"
  };

  // Run the log through the `preProcess` pipeline, which should add
  // the missing date
  const result = await preProcess(log);

  // Expect the message to be same
  expect(result.message).toEqual(log.message);

  // ... but a new `date` should be added
  expect(result.date).not.toBeUndefined();
});
