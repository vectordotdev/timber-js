# 🌲 Timber - Javascript tools

This library provides helper tools used by the [Javascript logger](https://github.com/timberio/npm-logger).

## Tools

### `Queue<T>`

Generic [FIFO](<https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)>) queue. Used by `makeThrottle` to store pipeline functions to be executed as concurrent 'slots' become available. Provides fast retrieval for any primitive or object that needs ordered, first-in, first-out retrieval.

**Usage example**

```typescript
import { Queue } from "@timberio/tools";

// Interface representing a person
interface IPerson {
  name: string;
  age: number;
}

// Create a queue to store `IPerson` objects
const q = new Queue<IPerson>();

// Add a couple of records...
q.push({ name: "Jeff", age: 50 });
q.push({ name: "Sally", age: 39 });

// Pull values from the queue...
while (q.length) {
  console.log(q.shift().name); // <-- first Jeff, then Sally...
}
```

### `makeThrottle<T>(max: number)`

Returns a `throttle` higher-order function, which wraps an `async` function, and limits the number of active Promises to `max: number`

The `throttle` function has this signature:

```
throttle(fn: T): (...args: InferArgs<T>[]) => Promise<InferArgs<T>>
```

**Usage example**

```typescript
import Timber from "@timberio/logger";
import { makeThrottle } from "@timberio/tools";

// Create a new Timber instance
const timber = new Timber("apiKey");

// Guarantee a pipeline will run a max of 2x at once
const throttle = makeThrottle(2);

// Create a basic pipeline function which resolves after 2 seconds
const pipeline = async log =>
  new Promise(resolve => {
    setTimeout(() => resolve(log), 2000);
  });

// Add a pipeline which has been throttled
timber.addPipeline(throttle(pipeline));

// Add 10 logs, and store the Promises
const promises = [];
for (let i = 0; i < 10; i++) {
  promises.push(timber.log({ message: `Hello ${i}` }));
}

void (async () => {
  void (await promises); // <-- will take 10 seconds total!
})();
```
