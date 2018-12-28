# 🌲 Timber - Node.js logging

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/node`

This NPM library is for logging in Node.js.

If you have a universal or client-side app that requires logging in the browser, check out [`@timberio/browser`](https://github.com/timberio/timber-js/tree/master/packages/browser) or [`@timberio/js`](https://github.com/timberio/timber-js/tree/master/packages/js) -- which combines the two packages.

Here's how to get started:

### Installation

Install the package directly from NPM:

```
npm i @timberio/node
```

### Importing

In ES6/Typescript, import the `Timber` class:

```typescript
import { Timber } from "@timberio/node";
```

For CommonJS, require the package:

```js
const { Timber } = require("@timberio/node");
```

## Creating a client

Simply pass your [Timber.io](https://timber.io) API key as a parameter to a new `Timber` instance:

```typescript
const timber = new Timber("api-goes-here");
```

## Documentation

This Node.js library extends [`@timberio/core`](https://github.com/timberio/timber-js/tree/master/packages/core), which provides a simple API for logging, adding middleware and more.

Visit the relevant readme section for more info/how-to:

- [Logging](https://github.com/timberio/timber-js/tree/master/packages/core#logging)
- [Middleware](https://github.com/timberio/timber-js/tree/master/packages/core#middleware)

### LICENSE

[ISC](LICENSE.md)
