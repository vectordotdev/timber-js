# 🌲 Timber - React logger

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/react`

This package exports a universal `<TimberProvider>` component for logging exceptions to [Timber.io](https://timber.io)

It can be used alongside either [`@timberio/node`](<(https://github.com/timberio/timber-js/tree/master/packages/node)>) or [`@timberio/browser`](<(https://github.com/timberio/timber-js/tree/master/packages/browser)>) for logging both in Node.js and browser environments.

It requires React 16+ to be installed as a peer dependency.

### Installation

Install the package directly from NPM:

```
npm i @timberio/react
```

### Importing

In ES6/Typescript, import the `TimberProvider` component:

```typescript
import { TimberProvider } from "@timberio/react";
```

For CommonJS, require the package:

```js
const { TimberProvider } = require("@timberio/react");
```

## Creating a client

First, create a `Timber` logger client in exactly the same way as you [usually would](https://github.com/timberio/timber-js/tree/master/packages/js#any-nodejs-environent-including-webpackrollup), and then pass it as a `logger` to the React HOC:

```ts
// In this case, we're using a `Browser` class to log in
// the browser... but you can also use `Node`
import { Browser as Timber } from "@timberio/js";

// Import the <TimberProvider> component
import { TimberProvider } from "@timberio/react";

// Create a client
const timber = new Timber("your-api-key-here");

// Use the HOC as a top-level component to log all exceptions...
// with your remaining React components as children
ReactDOM.hydrate(
  <TimberProvider logger={timber}>
    <Router history={history}>
      <Root />
    </Router>
  </TimberProvider>,
  document.getElementById("root"),
);
```

## Options

## How it works

Under the hood, `<TimberProvider>` uses React 16+'s [`componentDidCatch()` error boundary](https://reactjs.org/docs/error-boundaries.html) to capture exceptions that are thrown within child components.

Error details are added as context in a call to `timber.error()` and wind up in Timber.io with a `logLevel: error`

### LICENSE

[ISC](LICENSE.md)
