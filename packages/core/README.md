# 🌲 Timber - logging core

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/core`

This is an NPM package that provides core logging functionality.

It's used by the [Node](https://github.com/timberio/timber-js/tree/master/packages/node) and [browser](https://github.com/timberio/timber-js/tree/master/packages/browser) logging packages.

You typically wouldn't require this package directly, unless you're building a custom logger.

## The `Base` class

The [Base](src/base.ts) class provides core features that are extended by loggers.

For example - you could create a custom logger that implements its own sync method, for getting data over to [Timber.io](https://timber.io)

```typescript
import { Base } from "@timberio/core";
import { ITimberOptions, ITimberLog } from "@timberio/types";

class CustomLogger extends Base {
  // Constructor must take a Timber.io API key, and (optional) options
  public constructor(
    orgApiKey: string,
    sourceKey: string,
    options?: Partial<ITimberOptions>
  ) {
    // Make sure you pass the organization API + source key to the parent constructor!
    super(apiKey, sourceKey, options);

    // Create a custom sync method
    this.setSync(async (logs: ITimberLog[]) => {
      // Sync the `log` somehow ... `this._apiKey` contains your Timber organization API key

      // ....

      // Finally, return the log... which will resolve our initial `.log()` call
      return logs;
    });
  }
}
```

## Logging

Logging to Timber is simple - just call the `.log()` function with a string message:

```typescript
// Simple log message (defaults to the 'info' log level)
timber.log("Hello Timber!");

// Or, add custom context keys to pass along with the log
timber.log("Once more, with context", {
  httpRequest: {
    "user-agent": {
      browser: "Chrome"
    }
  }
});
```

There are four levels of logging, each corresponding to a function:

| Function | Log level                                                                                                  | Example                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| .debug() | Debug - logs to report/diagnose system events                                                              | Currently logged in session object, during development |
| .info()  | Info - data/events where no action is required; for information only                                       | User successfully logged in                            |
| .warn()  | Warning - advisory messages that something probably needs fixing, but not serious enough to cause an error | SQL query ran slower than expected                     |
| .error() | Error - something went wrong                                                                               | Couldn't connect to database                           |

By default, `.log()` logs at the 'info' level. You can use the above explicit log levels instead by calling the relevant function with your log message.

All log levels return a Promise that will resolve once the log has been synced with [Timber.io](https://timber.io):

```typescript
// Will resolve when synced with Timber.io (or reject if there's an error)
timber.log("some log message").then(log => {
  // `log` is the transformed log, after going through middleware
});
```

## Middleware

You can add your own middleware functions, which act as transforms on the _ITimberLog_ log object.

This is useful for augmenting the log prior to syncing with Timber, or even pushing the log to another service.

Here's what a middleware function looks like:

```typescript
import { ITimberLog } from "@timberio/types";

// In this example function, we'll add custom 'context' meta to the log
// representing the currently logged in user.
//
// Note: a middleware function is any function that takes an `ITimberLog`
// and returns a `Promise<ITimberLog>`
async function addCurrentUser(log: ITimberLog): Promise<ITimberLog> {
  return {
    ...log, // <-- copy the existing log
    user: {
      // ... and add our own `context` data
      id: 1000,
      name: "Lee"
    }
  };
}
```

Then just attach to the Timber instance with `.use`:

```typescript
timber.use(addCurrentUser);
```

You can add any number of pipeline functions to your logger instance, and they'll run in order.

Middleware functions run _before_ the final sync to Timber.io. Pipeline functions should return a `Promise<ITimberLog>`, making it possible to augment logs with asynchronous data from external sources.

**Note: If an exception is thrown anywhere in the pipeline chain, the log _won't_ be synced. Wrap an async `try/catch` block around your call to `.log|info|debug|warn|error()` or tack on a `.catch()` to ensure your errors are handled.**

### Removing middleware

If you wish to remove middleware, pass in the original middleware function to `.remove()`:

```typescript
// `addCurrentUser` will no longer be used to transform logs
timber.remove(addCurrentUser);
```

This will remove the middleware function from _all_ future calls to `.log|info|debug|warn|error()`.

To re-add middleware, pass it to `.use()`

### LICENSE

[ISC](LICENSE.md)
