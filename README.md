# 🌲 Timber - Beautiful Logging, Made Easy

## 👷‍️ WIP - Don't use yet! Use [this Timber JS lib](https://github.com/timberio/timber-node) for now

![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

[Timber.io](https://timber.io) is a hosted service for aggregating logs across your entire stack - any language, any platform, any data source.

Unlike traditional logging tools with proprietary log formats and protocols, Timber lets you capture system logs, visitor stats, user events and any other kind of log you wish to track, in whatever format makes sense for your app.

Environment-aware meta and relevant context data is added to your logs automatically, and Timber's rich free-form query tools and real-time tailing, make drilling down into important stats easier than ever.

The result: Beautiful, fast, powerful logging --

[![Timber Console](http://files.timber.io/images/readme-interface7.gif)](https://timber.io/docs/app)

Sign-up for a [free Timber account](https://timber.io) to access the console.

## Universal Javascript logging

Node.js and the browser are two of many [languages](https://docs.timber.io/languages/) and [platforms](https://docs.timber.io/platforms/) we support with an official logging library.

This Javascript library features:

- **Universal Node/browser support**. Log user/system errors, visits, clicks, events - _anything_ - in Chrome, Safari, Edge, or on a Node.js server, and search logs in real-time via the [Timber.io console](https://timber.io).

- **NPM or CDN**. Use natively in your app, Webpack/Rollup into your Node/browser bundle, or just drop in a `<script>` tag to your final HTML. Integrates easily into any app.

- **Written in Typescript; runs anywhere**. Enjoy a fully typed API, whether you use Typescript or plain JS. Plays nicely with any view engine (React, Angular, Vue, jQuery, etc), any web server (Express, Koa, HAPI, a static SPA, etc), and any back-end stack you can think of.

- **Blazing fast**. Queue 100 logs in ~1.5ms, with automatic background syncing, batching and throttling with Timber.io, optimising network I/O and reducing CPU load.

- **Guaranteed consistency**. `timber.log()` returns a Promise that resolves when the log has been ACK'd by Timber, so you know your log has been stored safely.

- **Easy logging middleware**. Pass an async func to `timber.use()` to chain your own transforms or log middleware; `.log()` only resolves when all middleware complete!

- **Light as a feather.** The gzipped browser bundle weighs in at just **4.3kb**!

- **Plays nicely with other loggers**. Using Bunyan or Winston? Official integrations are coming soon.

## Installation

### Guided

**Recommended:** Signup at [timber.io](https://app.timber.io/) and follow the in-app instructions.

### Manual

Logging works in Node.js or the browser. Choose the appropriate lib for installation instructions:

#### [`@timberio/node`](packages/node)

#### [`@timberio/browser`](packages/browser)

**Node.js**

Install with:

```
npm i @timberio/node
```

You can then create an instance of the logger with:

```typescript
// Choose the Node.js logger
import Timber from "@timberio/node";

// Pass in your Timber API key -- sign-up at timber.io to get yours
const timber = new Timber("apiKeyHere");

// To log
timber.log({ message: "Hello Timber!" }); // <-- returns a Promise when synced with Timber.io
```

**Browser / HTML apps**

Drop in the following `<script>` tag before the closing `</body>`:

```
<script src="https://unpkg.com/@timberio/logger@0.6.0/dist/umd/timber.js"></script>
```

This will give you a global `window.Timber` class, which you can instantiate with:

```
const timber = new Timber("apiKey")
```

## Browser and Node.js logging

The `@timberio/logger` package provides out-the-box support for browser and Node.js logging.

The package exports two classes:

```typescript
// Choose between browser or Node.js-flavored logging
import { Browser, Node } from "@timberio/logger";
```

You can create an instance of either class the same way - by passing an `apiKey: string` to the constructor:

```typescript
const logger = new Browser("api-key-goes-here");
```

Having separate classes means:

1. **Reduced bundle sizes/tree-shaking**. Imports are limited to the packages each environment requires, ensuring Webpack/Rollup can tree-shake out unused imports. The result is a less code for your users to download.

2. **Environment-aware enhancements**. `Node`, for example, offers a `fromStream(stream.Readable)` function (coming soon!), for reading logs from a stream; `Browser` will soon offer WebSocket support for quicker fast between the browser and Timber.io servers.

## Integrations

Coming soon - Bunyan, Winston and more.

## The logging pipeline

Logging to Timber is simple:

```typescript
timber.log({ message: "Hello Timber!", date: new Date() });
```

The `.log()` method returns a Promise, which resolves when the log has been synced with Timber.io

You can add your own 'pipeline' functions, which act as transforms on the passed `log: ITimberLog`. This is useful for adding your own logging middleware, or augmenting the log prior to syncing with Timber.

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
// Add a custom pipeline function
timber.addPipeline(preProcess);
```

Pipelines run _before_ the final sync to Timber.io. Pipeline functions should return a `Promise<ITimberLog>`, making it possible to augment logs, send to another destination, throw errors, etc.

**Note: If an exception is thrown anywhere in the pipeline chain, the log _won't_ be synced. Wrap an async `try/catch` block around your call to `.log()` or tack on a `.catch()` to ensure your errors are handled.**

### Syncing with Timber.io / extending the logger

By default, `Browser` and `Node` use a [throttled](https://github.com/timberio/npm-tools#makethrottletfuncmax-number) `fetch()` polyfill to sync requests with Timber.io.

A maximum of 5 log requests will be processed concurrently, to provide a sensible default for limiting network I/O.

If you want to change this, or create a new transport, the easiest method is extending the `Base` logger class and setting your own sync function:

```typescript
import { Base, ITimberLog } from "@timberio/logger";

class CustomLogger extends Base {
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

You can also call `.setSync()` _outside_ of a class method to overwrite the current sync method. If you do that, be sure to bind your inner function to the instance to get access to the stored `this._apiKey`

### LICENSE

[ISC](LICENSE.md)
