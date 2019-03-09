# 🌲 Timber - Bunyan writable stream

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/bunyan`

This NPM library provides a [Bunyan](https://github.com/trentm/node-bunyan) writable stream that transmits logs to Timber.io via the `@timberio/node` logger.

Here's how to get started:

## Installation

Install the Node.js Timber logger and the Bunyan stream plugin via NPM:

```
npm i @timberio/node @timberio/bunyan
```

## Importing

In ES6/Typescript, import both the `Timber` logger class and the Timber Bunyan stream class:

```typescript
import { Timber } from "@timberio/node";
import { TimberStream } from "@timberio/bunyan";
```

For CommonJS, require the packages instead:

```js
const { Timber } = require("@timberio/node");
const { TimberStream } = require("@timberio/bunyan");
```

## Creating a client/stram

You can [create a client](https://github.com/timberio/timber-js/tree/master/packages/node#creating-a-client) the usual way for `@timberio/node`, and then pass it into a new instance of `TimberStream`:

```typescript
// Assuming you've imported the Timber packages above, also import Bunyan...
import bunyan from "bunyan";

// Create a Timber client
const timber = new Timber("api-key-here");

// Create a Bunyan logger - passing in the Timber stream
const logger = bunyan.createLogger({
  name: "Example logger",
  level: "debug",
  streams: [
    {
      stream: new TimberStream(timber)
    }
  ]
});

// Log as normal in Bunyan - your logs will sync with Timber.io!
logger.info("Hello from Bunyan");
```

## Log levels

Timber will log at the `debug` level and above. Trace logs or any log level below `20` will be ignored.

The `fatal` log level is transformed to `error` in the Timber logger.

## LICENSE

[ISC](LICENSE.md)
