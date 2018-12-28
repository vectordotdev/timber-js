# 🌲 Timber - Browser logging

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/browser`

This NPM library is for logging in the browser.

Here's how to get started:

### Using Webpack / Rollup

If you're using a module bundler like Webpack or Rollup, you can install the package directly from NPM:

```
npm i @timberio/browser
```

In ES6/Typescript, import the `Timber` class:

```typescript
import { Timber } from "@timberio/browser";
```

For CommonJS, require the package:

```js
const { Timber } = require("@timberio/browser");
```

### Via a `<script>` tag

If you're not using a Node.js module bundler, you can log in any client-side app by dropping in a `<script>` tag:

```
<script src="https://unpkg.com/@timberio/browser@0.21.0/dist/umd/timber.js"></script>
```

This will place the `Timber` class on `window.Timber`.

## Creating a client

You can instantiate the client in the same way, whether you use a module bundler or the `<script>` tag method.

Simply pass your [Timber.io](https://timber.io) API key as a parameter to a new `Timber` instance:

```typescript
const timber = new Timber("api-goes-here");
```

## Documentation

This browser library extends [`@timberio/core`](https://github.com/timberio/timber-js/tree/master/packages/core), which provides a simple API for logging, adding middleware and more.

Visit the relevant readme section for more info/how-to:

- [Logging](https://github.com/timberio/timber-js/tree/master/packages/core#logging)
- [Middleware](https://github.com/timberio/timber-js/tree/master/packages/core#middleware)

### LICENSE

[ISC](LICENSE.md)
# 🌲 Timber - Browser logging

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/browser`

This NPM library is for logging in the browser.

Here's how to get started:

### Using Webpack / Rollup

If you're using a module bundler like Webpack or Rollup, you can install the package directly from NPM:

```
npm i @timberio/browser
```

In ES6/Typescript, import the `Timber` class:

```typescript
import { Timber } from "@timberio/browser";
```

For CommonJS, require the package:

```js
const { Timber } = require("@timberio/browser");
```

### Via a `<script>` tag

If you're not using a Node.js module bundler, you can log in any client-side app by dropping in a `<script>` tag:

```
<script src="https://unpkg.com/@timberio/browser@0.21.0/dist/umd/timber.js"></script>
```

This will place the `Timber` class on `window.Timber`.

## Creating a client

You can instantiate the client in the same way, whether you use a module bundler or the `<script>` tag method.

Simply pass your [Timber.io](https://timber.io) API key as a parameter to a new `Timber` instance:

```typescript
const timber = new Timber("api-goes-here");
```

## Documentation

This browser library extends [`@timberio/core`](https://github.com/timberio/timber-js/tree/master/packages/core), which provides a simple API for logging, adding middleware and more.

Visit the relevant readme section for more info/how-to:

- [Logging](https://github.com/timberio/timber-js/tree/master/packages/core#logging)
- [Middleware](https://github.com/timberio/timber-js/tree/master/packages/core#middleware)

### LICENSE

[ISC](LICENSE.md)
