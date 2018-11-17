# 🌲 Timber - Beautiful Logging, Made Easy

[Timber.io](https://timber.io) is a hosted service for aggregating logs across your entire stack - any language, any platform, any data source.

Unlike traditional logging tools with proprietary log formats and protocols, Timber lets you capture system logs, visitor stats, user events and any other kind of log you wish to track, in whatever format makes sense for your app.

Environment-aware meta and relevant context data is added to your logs automatically, and Timber's rich free-form query tools and real-time tailing, make drilling down into important stats easier than ever.

The result: Beautiful, fast, powerful logging --

[![Timber Console](http://files.timber.io/images/readme-interface7.gif)](https://timber.io/docs/app)

Sign-up for a [free Timber account](https://timber.io) to access the console.

## Universal Javascript logging

Node.js and the browser are two of many [languages](https://docs.timber.io/languages/) and [platforms](https://docs.timber.io/platforms/) we support with an official logging library.

This Javascript library features:

- **Isomorphic Node/browser support**. Log user/system errors, visits, clicks, events - _anything_ - in Chrome, Safari, Edge, or on a Node.js server, and search logs in real-time via the [Timber.io console](https://timber.io).

- **NPM or CDN**. `npm i timber` or drop in a `<script src="https://cdn.timber.io/logger.js></script>` tag to your HTML

- **Written in Typescript; runs anywhere**. Enjoy a fully typed API, whether you use Typescript or plain JS. Plays nicely with React, Angular

- **Blazing fast**. Queue 100 logs in < 1.5ms, with automatic background syncing, batching and throttling with Timber.io, optimising network I/O and reducing CPU load.

- **Environment-aware optimizations**. Import in Node.js, and syncing will use the native `http.request` lib. Drop in the browser, and it'll switch to WebSockets and register as a web worker, keeping your app's performance tip-top.

- **Guaranteed consistency**. `timber.log()` returns a Promise that resolves when the log has been ACK'd by Timber, so you know your log has been stored safely.

- **Easy hooks/pipeline middleware**. Pass an async func to `timber.addPipeline()` to chain your own transforms or log middleware; `.log()` only resolves when it completes!

- **Light as a feather.** Zero external dependencies. The gzipped browser bundle weighs in at just XXkb!

## Installation

The Timber JS lib can be installed easily in any Javascript app, whether it's running on Node, built via Webpack/Rollup, or served directly from our CDN on any web page:

### Node.js / Webpack / Rollup

Install with NPM/Yarn:

```
npm i timber
```

### Via a `<script>` tag

WIP, TBA
