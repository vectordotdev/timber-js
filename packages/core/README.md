# 🌲 Timber - logging core

## 👷‍️ WIP - Don't use yet! Use [this Timber JS lib](https://github.com/timberio/timber-node) for now

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/core`

This is an NPM package that provides core logging functionality.

It's used by the [Node](https://github.com/timberio/timber-js/tree/master/packages/node) and [browser](https://github.com/timberio/timber-js/tree/master/packages/browser) logging packages.

You typically wouldn't require this package directly, unless you're building a custom logger.

## The `Base` class

The [Base](src/base.ts) class provides core features that is extended by loggers.

For example - you could create a custom logger that implements its own sync method, for getting data over to [Timber.io](https://timber.io)

```typescript
import { Base } from "@timberio/core";

class CustomLogger extends Base {
  // Constructor must take a Timber.io API key
  public constructor(apiKey: string) {
    // Make sure you pass the API key to the parent constructor!
    super(apiKey);

    // Create a custom sync method
    this.setSync(async (log: ITimberLog) => {
      // Sync the `log` somehow ... `this._apiKey` contains your Timber API key

      // ....

      // Finally, return the log... which will resolve our initial `.log()` call
      return log;
    });
  }
}
```

## The logging pipeline

Logging to Timber is simple - just call the `.log()` function.

```typescript
timber.log({ message: "Hello Timber!", date: new Date() });
```

The `.log()` method returns a Promise, which resolves when the log has been synced with Timber.io

You can add your own 'pipeline' middlware functions, which act as transforms on the passed `log: ITimberLog`. This is useful for adding your own logging middleware, or augmenting the log prior to syncing with Timber.

For example, there's an implicit `preProcess` pipeline that adds an explicit date timestamp to a log that lacks one:

```typescript
async function preProcess(log: ITimberLog): Promise<ITimberLog> {
  return {
    date: new Date(),
    ...log
  };
}
```

You can add any number of pipeline functions to your logger instance (which will run in order):

```typescript
// Add a custom pipeline function - aka middleware
timber.use(preProcess);
```

Pipelines run _before_ the final sync to Timber.io. Pipeline functions should return a `Promise<ITimberLog>`, making it possible to augment logs, send to another destination, throw errors, etc.

**Note: If an exception is thrown anywhere in the pipeline chain, the log _won't_ be synced. Wrap an async `try/catch` block around your call to `.log()` or tack on a `.catch()` to ensure your errors are handled.**

> More docs TBA
