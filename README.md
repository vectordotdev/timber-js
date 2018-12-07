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

#### [`@timberio/node`](packages/node) <-- for Node.js logging

#### [`@timberio/browser`](packages/browser) <-- for browser logging

#### [`@timberio/js`](packages/js) <-- both Node.js/browser logging, in a single package

There are a few helper libraries available that you typically won't need to use directly:

#### [`@timberio/core`](packages/core) <-- core library to extend for custom loggers

#### [`@timberio/tools`](packages/tools) <-- tools/utils used by loggers for throttling, batching, queuing logs

#### [`@timberio/types`](packages/tools) <-- shared Typescript types

## Integrations

Coming soon - Bunyan, Winston and more.

### LICENSE

[ISC](LICENSE.md)
