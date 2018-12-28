# 🌲 Timber - Beautiful Logging, Made Easy

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

[Timber.io](https://timber.io) is a hosted service for aggregating logs across your entire stack - any language, any platform, any data source.

Unlike traditional logging tools with proprietary log formats and protocols, Timber lets you capture system logs, visitor stats, user events and any other kind of log you wish to track, in whatever format makes sense for your app.

Environment-aware meta and relevant context data is added to your logs automatically, and Timber's rich free-form query tools and real-time tailing, make drilling down into important stats easier than ever.

The result: Beautiful, fast, powerful logging.

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

### Quick Start

First, install the universal Timber JS library:

```
npm i @timberio/js
```

Then in your code, import the relevant logger -- either `Browser` (for any web browser) or `Node` for Node.js logging:

```typescript
import { Browser, Node } from "@timberio/js";

// Create either a browser logger...
const browserLogger = new Browser("timber-api-key");

// ... or a Node logger (or both!)
const nodeLogger = new Node("timber-api-key");

// You can log by .debug, .info, .warn or .error -- returns a Promise
browserLogger.info("Hello from the browser!").then(log => {
  // At this point, your log is synced with Timber.io!
});
```

### Custom

Logging works in Node.js or the browser. Choose the appropriate lib for installation instructions:

| Package                                 | What's it for?                               |
| --------------------------------------- | -------------------------------------------- |
| [`@timberio/node`](packages/node)       | Node.js logger                               |
| [`@timberio/browser`](packages/browser) | Browser logger                               |
| [`@timberio/js`](packages/js)           | Node.js/browser logging, in a single package |

### Helper libraries

There are a few helper libraries available that you typically won't need to use directly:

| Package                             | What's it for?                                                     |
| ----------------------------------- | ------------------------------------------------------------------ |
| [`@timberio/core`](packages/core)   | Core library to extend for custom loggers                          |
| [`@timberio/tools`](packages/tools) | Tools/utils used by loggers for throttling, batching, queuing logs |
| [`@timberio/types`](packages/types) | Shared Typescript types                                            |

## Integrations

Coming soon - Bunyan, Winston and more.

## Performance

This library provides out-the-box defaults for [batching](https://github.com/timberio/timber-js/tree/master/packages/tools#makebatchsize-number-flushtimeout-number) calls to `.log()` and [throttling](https://github.com/timberio/timber-js/tree/master/packages/tools#makethrottletmax-number) synchronization with Timber.io, aiming to provide a balance between strong performance and sensible resource usage.

We believe a logging library should be a good citizen of your stack - avoiding unnecessary slow-downs in your app down due to excessive network I/O or large memory usage.

By default, the library will batch up to **1,000** logs at a time (emitting after **1,000ms**, whichever is sooner), and open up to **5** concurrent network requests to [Timber.io](https://timber.io) for syncing.

These defaults can be tweaked by passing [custom options](https://github.com/timberio/timber-js/tree/master/packages/types#itimberoptions) when creating your `Timber` instance:

```typescript
const timber = new Timber("api-key-here", {
  // Maximum number of logs to sync in a single request to Timber.io
  batchSize: 1000,

  // Max interval (in milliseconds) before a batch of logs proceeds to syncing
  batchInterval: 1000,

  // Maximum number of sync requests to make concurrently (useful to limit
  // network I/O)
  syncMax: 100 // <-- we've increased concurrent network connections up to 100
});
```

### Metrics

This table shows the time to synchronize **10,000 logs** raised by calling `.log()` 10,000x on a 2.2Ghz Intel Core i7 Macbook Pro with 16GB of RAM based in the UK, calling the Timber.io service hosted in US-East, based on various `syncMax` connections:

| Connections | Time to sync 10k logs (in ms) | Improvement vs. last |
| ----------- | ----------------------------- | -------------------- |
| 1           | 72506.09                      | -                    |
| 2           | 34852.11                      | 108.04%              |
| 5           | 14488.63                      | 140.55%              |
| 10          | 7501.31                       | 93.15%               |
| 20          | 3876.49                       | 93.51%               |
| 50          | 2150.37                       | 80.27%               |
| 100         | 1736.81                       | 23.81%               |
| 200         | 1706.66                       | 1.77%                |

In general, a higher `syncMax` number (i.e. number of concurrent throttled connections made to [Timber.io](https://timber.io)) will provide linear improvements in total time to sync logs vs. lower numbers.

Bear in mind:

1. This simple benchmark was performed on 10,000 immediate calls to `.log()`, which is unlikely to represent typical usage. A more common pattern in a typical app would be periodic log events, followed by periods of inactivity.
2. Although higher numbers naturally synchronize more quickly (due to concurrent network calls to timber.io), most apps will run sufficiently with just 1-2 open network requests since it's likely that the default `batchSize: 1000` will be enough to capture 99.9% of logging workloads within the default `batchInterval: 1000`ms time period before proceeding to sync with Timber servers.
3. Performance drops sharply after 50 concurrent connections (and infers almost no extra benefit after 100), likely due to the latency between the test machine and the Timber.io server.
4. A typical app won't need to consider performance; the defaults will be be sufficient.

### Recommendations

Based on your logging use-case, the following base-line recommendations can be considered when instantiating a new `Timber` instance:

| If you have...                                                                                     | Recommendations                                                                                                                  |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A large number of logs, fired frequently, and want them to sync very quickly                       | Increase `syncMax` (`50`-`100` is a good default); lower `batchInterval` to `200`ms to emit faster                               |
| Logs events that occur less frequently                                                             | Decrease `batchInterval` to `100`ms, so synchronization with Timber will start within 1/10th of a second                         |
| An app that needs to preserve network I/O or limit outgoing requests                               | Drop `syncMax` to `5`; increase `batchInterval` to `2000`ms to fire less often                                                   |
| Intermittent periods of large logging activity (and you want fast syncing), followed by inactivity | Increase `syncMax` to `20` to 'burst' connections as needed; lower `batchSize` to match your typical log activity to emit faster |

Or, you can simply leave the default settings in place, which will be adequate for the vast majority of applications.

### Log limits

When you log via `.log()`, you're creating a Promise that resolves when the log has been synchronized with [Timber.io](https://timber.io)

This provides a mechanism for guaranteed consistency in your application.

While there are no hard limits on firing `.log()` events, the effective limit of concurrent logs will be determined by memory available to your Node.js V8 process (or in the user's browser, for browser logging.) to create a new stack for each Promise executed.

As a general rule, you might run into stack size limits beyond 100,000 - 500,000 concurrent logs -- therefore, we recommend adjusting your `syncMax`, `batchSize` and `batchInterval` settings to ensure that logs aren't sitting around in memory for long periods of time, awaiting synchronization with Timber.io.

This is a sensible strategy regardless of memory limits, to ensure logs are being written consistently to Timber and are not at risk of loss due to an app crash or server downtime.

Note: This only applies if you are working with an application that emits a large number of logs (100,000+) at short intervals (within a 5-10 second window.) 99%+ of apps will see adequate performance with the default settings.

## FAQs

**Which package should I install to start logging?**

For most Javascript projects, just `npm i @timberio/js`.

This will install both the [Node.js](packages/node) and [browser](packages/browser) versions in a single package.

Alternatively, if you only need to log in a single environment, import [`@timberio/browser`](packages/browser) or [`@timberio/node`](packages/node) directly.

**Why are there separate loggers for Node/the browser?**

Both loggers extend [`@timberio/core`](packages/core), and share the same `.log()` API.

But each offer unique features optimized for the target environment.

For example, the browser version uses built-in features of a client's web browser and client-side `fetch()` to synchronize logs with Timber.io. The result is a fast, and nimble `<script>` tag or bundle that drops easily into any client-side app.

The Node version includes features such as _msgpack_ encoding, logging from streams and deep exception handling (coming soon!), which are specific to Node.js and would have no purpose in a client-side logger.

Importing a distinct version of the logger makes it simple for bundlers like [Parcel](https://parceljs.org/) or [Webpack](https://webpack.js.org/) to leave out the parts that aren't required in the browser, resulting in a much smaller download &mdash; only 4.3kb!

**Are Typescript types available?**

Yes! Every part of the Timber JS library is written in Typescript, so you get full types (and documentation) right out-the-box.

**The root `package.json` is named `@timberio/logger` - do I need to import this?**

Nope. This library and its associated components are laid out as a mono-repo using [Lerna](https://github.com/lerna/lerna), to make it easier to maintain all code from one home on Github.

`@timberio/logger` is the private name that governs all code, tests and other stuff that only concerns the maintainers of this library, and is not importable.

Instead, simply use [`@timberio/js`](packages/js)

**Do you accept PRs / feature suggestions?**

Right now, the best way to have a feature considered is to make a suggestion using [git issues](issues).

Soon, we'll have contribution guidelines and will be accept community code submissions at that time.

### LICENSE

[ISC](LICENSE.md)
