# 🌲 Timber - Koa logging

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/koa`

This NPM library is for logging [Koa](https://koajs.com/) HTTP web server requests.

It extends the [Timber Node JS library](https://github.com/timberio/timber-js/tree/master/packages/node) with Koa middleware.

## Installation

Install the package directly from NPM:

```
npm i @timberio/koa
```

## Importing

In ES6/Typescript, import the `Timber` class:

```typescript
import { Timber } from "@timberio/koa";
```

For CommonJS, require the package:

```js
const { Timber } = require("@timberio/koa");
```

## Creating a client

Simply pass your [Timber.io](https://timber.io) API key as a parameter to a new `Timber` instance:

```typescript
const timber = new Timber("api-goes-here");
```

`Timber` accepts two optional, additional parameters:

1. [Core logging options](https://github.com/timberio/timber-js/tree/master/packages/types#itimberoptions), allowing you to tweak the interval logs will be sent to Timber.io, how many concurrent network connections the logger should use, and more. See type [`ITimberOptions`](https://github.com/timberio/timber-js/tree/master/packages/types#itimberoptions) for details.

2. Koa logging options, specified below.

These can be passed when creating a new `Timber` instance as follows:

```typescript
const timberOptions = {
  /**
   * For example -- setting the maximum number of sync requests to
   * make concurrently (useful to limit network I/O)
   */
  syncMax: 10,
};

const koaOptions = {
  // Override default Koa context data to include in each log
  contextPaths: ["statusCode", "request.headers", "request.method"],
};

const timber = new Timber("api-goes-here", timberOptions, koaOptions);
```

## Attaching to Koa

To activate the plugin and enable logging, simply attach a Koa instance:

```typescript
import Koa from "koa";
import { Timber } from "@timberio/koa";

// Create a new Koa instance
const koa = new Koa();

// Create a new Timber client
const timber = new Timber("api-key");

// Attach Koa to enable HTTP request logging
timber.attach(koa);
```

## Koa options

Koa options passed to a new `Timber` are of type `IKoaOptions`:

```typescript
interface IKoaOptions {
  /**
   * Properties to pluck from the Koa `Context` object
   */
  contextPaths: string[];
}
```

Here are the default properties, which can be overridden:

### `contextPaths`

A `string[]` of paths to pluck from the Koa `ctx` object, which contains details about the request and response of a given Koa HTTP call.

Nested object properties are separated using a period (`.`)

```js
[
  "statusCode",
  "request.headers",
  "request.method",
  "request.length",
  "request.url",
  "request.query",
];
```

## How logging works

All HTTP requests handled by Koa will be logged automatically, and synced with the [Timber.io](https://timber.io) service, to the source defined by your Timber API key.

### Successful requests

A 'successful' request is one that returns a non-`4xx` or `5xx` status code, and doesn't throw any uncaught errors while handling the requests.

These are logged to Timber using [`LogLevel.Info`](https://github.com/timberio/timber-js/tree/master/packages/types#loglevel) with the log message:

```
Koa HTTP request: ${ctx.status}
```

### 4xx status codes

These are not considered errors but warnings, and log with the same message using [`LogLevel.Warn`](https://github.com/timberio/timber-js/tree/master/packages/types#loglevel)

A typical example of a 4xx class of response would be `404 Not Found` or `401 Unauthorized`.

### 5xx status codes

Responses that contain a `5xx` status code are considered errors, and are logged with [`LogLevel.Error`](https://github.com/timberio/timber-js/tree/master/packages/types#loglevel)

An example of a 5xx status code is `500 Internal Server Error` - typically indicating that something unexpected has happened.

### Uncaught errors

If an error is thrown in Koa middleware and remains uncaught, the Timber middleware handling will catch, log it with [`LogLevel.Error`](https://github.com/timberio/timber-js/tree/master/packages/types#loglevel) and re-throw, to handle in your own code.

The log message will be:

```
`Koa HTTP request error: ${(typeof e === "object" && e.message) || e}`
```

If the error thrown is a regular Node.js error object (i.e. has a `.message` property), it will be interpolated with the log message.

Otherwise, an attempt will be made to stringify the message.

If your app throws non-errors, it's recommended that you catch the thrown entity in your code and throw a regular Node.js instead, to provide a useful string message to your log.

## Additional logging

Since this Koa plugin extends the regular [`@timberio/node`](https://github.com/timberio/timber-js/tree/master/packages/node) logger, you can use the `.log|info|warn|error` functions as normal to handle logging anywhere in your app.

See the [Timber Node.js logger documentation](https://github.com/timberio/timber-js/tree/master/packages/node#documentation) for details.

## LICENSE

[ISC](LICENSE.md)
