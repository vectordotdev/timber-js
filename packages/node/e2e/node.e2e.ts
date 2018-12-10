import { Node as Timber } from "../src/node";

// Init Node logging lib
const timber = new Timber(process.env.TIMBER_API_KEY!, {
  syncMax: 10
});

// Build a collection of log messages
const logs = [...Array(50).keys()].map(i => {
  message: `Log message ${i}`;
});

//
