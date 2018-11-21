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

- **Easy hooks/pipeline middleware**. Pass an async func to `timber.addPipeline()` to chain your own transforms or log middleware; `.log()` only resolves when all pipelines complete!

- **Light as a feather.** Zero external dependencies in the browser version. The gzipped browser bundle weighs in at just XXkb!

- **Plays nicely with other loggers**. Using Bunyan or Winston? There are integrations for that.

## Installation

### Guided

**Recommended:** Signup at [timber.io](https://app.timber.io/) and follow the in-app instructions.

### Manual

The Timber Javascript lib integrates easily into any Node.js, Webpack/Rollup or HTML app:

**Node.js, Webpack/Rollup, universal apps**

Install with:

```
npm i @timberio/logger
```

You can then create an instance of the logger with:

```ts
import Timber from "@timberio/logger";

// Pass in your Timber API key -- sign-up at timber.io to get yours
const timber = new Timber("apiKeyHere");

// To log
timber.log({ message: "Hello Timber!" }); // <-- returns a Promise when ACK'd
```

**Browser / HTML apps**

Drop in the following `<script>` tag before the closing `</body>`:

```
<script src="TODO-INSERT-REAL-LINK"></script>
```

This will give you a global `window.Timber` class, which you can instantiate with:

```
const timber = new Timber("apiKey")
```

## Integrations

TBA

## The logging pipeline

TBA
