# 🌲 Timber - Browser logging

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
<script src="https://unpkg.com/@timberio/browser@0.9.2/dist/umd/timber.js"></script>
```

This will place the `Timber` class on `window.Timber`.

### Creating a logging client

You can instantiate the client in the same way, whether you use a module bundler or the `<script>` tag method.

Simply pass your [Timber.io](https://timber.io) API key as a parameter to a new `Timber` instance:

```typescript
const timber = new Timber("api-goes-here");
```

### Logging

TBA
