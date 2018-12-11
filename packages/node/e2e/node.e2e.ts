import { Node as Timber } from "../src/node";

// Fixtures
const logLabel = "Node logging";

// Init Node logging lib
const timber = new Timber(process.env.TIMBER_API_KEY!, {
  batchSize: 1000,
  syncMax: 50
});

// Build a collection of 10,000 log messages
const messages = [...Array(10000).keys()].map(i => `Log message ${i}`);

// Log the start time
console.time(logLabel);

// Await syncing to Timber.io
Promise.all(messages.map(m => timber.info(m))).then(() => {
  // Log the end time
  console.timeEnd(logLabel);
});
