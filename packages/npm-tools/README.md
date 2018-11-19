# 🌲 Timber - Javascript tools

This library provides helper tools used by the [Javascript logger](https://github.com/timberio/npm-logger).

## Tools

### `makeThrottle(max: number)`

Returns a `throttle` higher-order function, which wraps an `async` function, and limits the number of active Promises to `max: number`

The `throttle` function has this signature:

```
throttle<TFunc, TPromise>(fn: TFunc): TFunc
```

**Usage example**

```typescript
import Timber from "@timberio/logger";
import makeThrottle from "@timberio/tools/throttle"

// Create a new Timber instance
const timber = new Timber("apiKey")

// Guarantee a pipeline will run a max of 2x at once
const throttle = createThrottle(2)

// Create a basic pipeline function which resolves after 2 seconds
const pipeline = async log => new Promise(resolve => {
    setTimeout(() => resolve(log), 2000)
})

// Add a pipeline which has been throttled
timber.addPipeline(throttle(pipeline))

// Add 10 logs, and store the Promises
const promises = []
for (let i = 0; i < 10; i++) {
  promises.push(timber.log({ message: `Hello ${i}`}))
}

void (async () => {
  void await promises; // <-- will take 10 seconds total!
})()
```