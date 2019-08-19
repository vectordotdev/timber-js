# 🌲 Timber - Shared Typescript types

![Beta: Ready for testing](https://img.shields.io/badge/early_release-beta-green.svg)
![Speed: Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

**New to Timber?** [Here's a low-down on logging in Javascript.](https://github.com/timberio/timber-js)

## `@timberio/types`

The Timber JS library packages are written in Typescript.

Various types are shared between multiple packages. Those shared types have been separated out into their own package, to make it easier for importing.

That's what you'll find in this package.

## Importing types

You can import a shared type into a Typescript project by importing directly from this package:

```typescript
// For example, `ITimberLog`
import { ITimberLog } from "@timberio/types";
```

## Types

### `ITimberOptions`

Config options for the Timber [Base class](https://github.com/timberio/timber-js/tree/master/packages/core#the-base-class) for creating a Timber client instance.

```typescript
export interface ITimberOptions {
  /**
   * Endpoint URL for syncing logs with Timber.io
   */
  endpoint: string;

  /**
   * Maximum number of logs to sync in a single request to Timber.io
   */
  batchSize: number;

  /**
   * Max interval (in milliseconds) before a batch of logs proceeds to syncing
   */
  batchInterval: number;

  /**
   * Maximum number of sync requests to make concurrently (useful to limit
   * network I/O)
   */
  syncMax: number;

  /**
   * Boolean to specify whether thrown errors/failed logs should be ignored
   */
  ignoreExceptions: boolean;
}
```

### `LogLevel`

Enum representing a log level between _debug_ -> _error_:

```typescript
enum LogLevel {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error"
}
```

### `Context`

You can add meta information to your logs by adding a `string`, `boolean`, `Date` or `number` to a string field (or any nested object containing fields of the same.)

We call this 'context' and these are the types:

```typescript
/**
 * Context type - a string/number/bool/Date, or a nested object of the same
 */
export type ContextKey = string | number | boolean | Date;
export type Context = { [key: string]: ContextKey | Context };
```

### `ITimberLog`

The log object which is implicitly created by calling `.log()` (or any explicit log level function - e.g. `.info()`), and is passed down the chain for Timber middleware before syncing with [Timber.io](https://timber.io)

```typescript
interface ITimberLog {
  dt: Date;
  level: LogLevel; // <-- see `LogLevel` above
  message: string;
  [key: string]: ContextKey | Context; // <-- see `Context` above
}
```

### `Middleware`

A type representing a [Middleware function](https://github.com/timberio/timber-js/tree/master/packages/core#middleware) passed to `.use()` (or `.remove()`)

```typescript
type Middleware = (log: ITimberLog) => Promise<ITimberLog>;
```

### `Sync`

The type of the function passed to `.setSync()`, for syncing a log with [Timber.io](https://timber.io):

Note: Differs from the `Middleware` type because it receives - and resolves to a Promise of - an array of batched `ITimberLog`.

```typescript
Sync = (logs: ITimberLog[]) => Promise<ITimberLog[]>
```

## LICENSE

[ISC](LICENSE.md)
