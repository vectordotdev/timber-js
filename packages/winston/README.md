# 🌲 Timber - Winston transport

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/winston`

This NPM library is for creating a [Winston 3.x](https://github.com/winstonjs/winston)-compatible transport that transmits logs to Timber.io via the `@timberio/node` logger.

Here's how to get started:

## Installation

Install the Node.js Timber logger and the Winston transport via NPM:

```
npm i @timberio/node @timberio/winston
```

## Importing

In ES6/Typescript, import both the `Timber` logger class and the Timber Winston transport class:

```typescript
import { Timber } from "@timberio/node";
import { TimberTransport } from "@timberio/winston";
```

For CommonJS, require the packages instead:

```js
const { Timber } = require("@timberio/node");
const { TimberTransport } = require("@timberio/winston");
```

## Creating a client/transport

You can [create a client](https://github.com/timberio/timber-js/tree/master/packages/node#creating-a-client) the usual way for `@timberio/node`, and then pass it into a new instance of `TimberTransport`:

```typescript
// Assuming you've imported the Timber packages above,
// also import Winston...
import winston from "winston";

// Create a Timber client
const timber = new Timber("api-key-here");

// Create a Winston logger - passing in the Timber transport
const logger = winston.createLogger({
  transports: [new TimberTransport(timber)]
});

// Log as normal in Winston - your logs will sync with Timber.io!
logger.log({
  level: "info", // <-- will use Timber's `info` log level,
  message: "Some message" // <-- will also be passed to Timber
});
```

## LICENSE

[ISC](LICENSE.md)
