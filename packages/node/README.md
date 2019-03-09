# 🌲 Timber - Node.js logging

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/node`

This NPM library is for logging in Node.js.

If you have a universal or client-side app that requires logging in the browser, check out [`@timberio/browser`](https://github.com/timberio/timber-js/tree/master/packages/browser) or [`@timberio/js`](https://github.com/timberio/timber-js/tree/master/packages/js) (which combines the two packages.)

Here's how to get started:

## Installation

Install the package directly from NPM:

```
npm i @timberio/node
```

## Importing

In ES6/Typescript, import the `Timber` class:

```typescript
import { Timber } from "@timberio/node";
```

For CommonJS, require the package:

```js
const { Timber } = require("@timberio/node");
```

## Creating a client

Simply pass your [Timber.io](https://timber.io) organization API + source keys as parameters to a new `Timber` instance (you can grab both from the Timber.io console):

```typescript
const timber = new Timber("timber-organization-key", "timber-source-key");
```

## Documentation

This Node.js library extends [`@timberio/core`](https://github.com/timberio/timber-js/tree/master/packages/core), which provides a simple API for logging, adding middleware and more.

Visit the relevant readme section for more info/how-to:

- [Logging](https://github.com/timberio/timber-js/tree/master/packages/core#logging)
- [Middleware](https://github.com/timberio/timber-js/tree/master/packages/core#middleware)

## Streaming

In addition to [`.log|debug|info|warn|error()` returning a Promise](https://github.com/timberio/timber-js/tree/master/packages/core#logging), the Node.js logger offers a `.pipe()` function for piping successfully synchronized logs to any writable stream.

This makes it trivial to additionally save logs to a file, stream logs over the network, or interface with other loggers that accept streamed data.

Here's a simple example of saving logs to a `logs.txt` file:

```typescript
// Import the Node.js `fs` lib
import * as fs from "fs";

// Import the Node.js Timber library
import { Timber } from "@timberio/node";

// Open a writable stream to `logs.txt`
const logsTxt = fs.createWriteStream("./logs.txt");

// Create a new Timber instance, and pipe output to `logs.txt`
const timber = new Timber("timber-organization-key", "timber-source-key");
timber.pipe(logsTxt);

// When you next log, `logs.txt` will get a JSON string copy
timber.log("This will also show up in logs.txt");
```

Streamed logs passed to your write stream's `.write()` function will be JSON strings in the format of type [`ITimberLog`](https://github.com/timberio/timber-js/tree/master/packages/types#itimberlog), and always contain exactly one complete log _after_ it has been transformed by middleware _and_ synced with Timber.io.

e.g:

```text
{"dt":"2018-12-29T08:38:33.272Z","level":"info","message":"message 1"}
```

If you want to further process logs in your stream, remember to `JSON.parse(chunk.toString())` the written 'chunk', to turn it back into an [`ITimberLog`](https://github.com/timberio/timber-js/tree/master/packages/types#itimberlog) object.

Calls to `.pipe()` will return the passed writable stream, allowing you to chain multiple `.pipe()` operations or access any other stream function:

```typescript
// Import a 'pass-through' stream, to prove it works
import { PassThrough } from "stream";

// This stream won't do anything, except copy input -> output
const passThroughStream = new PassThrough();

// Passing to multiple streams works...
timber.pipe(passThroughStream).pipe(logsTxt);
```

## LICENSE

[ISC](LICENSE.md)
