"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Default options to use with a new Timber instance
 */
const defaultOptions = {
  syncInterval: 1000
};
/**
 * Timber core class for logging to the Timber.io service
 */
class Timber {
  /**
   * Initializes a new Timber instance
   *
   * @param apiKey - Private API key for logging to Timber.io
   * @param options - Configuration options
   */
  constructor(apiKey, options = {}) {
    this._event = new events_1.default();
    this._countLogged = 0;
    this._countSynced = 0;
    this._options = Object.assign({}, defaultOptions, options);
    // Some basic error checking...
    // API key
    if (typeof apiKey !== "string" || !apiKey) {
      throw new Error("Cannot init Timber logging. Missing API key.");
    }
    // Sync interval should be >= 500ms
    if (
      typeof this._options.syncInterval !== "number" ||
      this._options.syncInterval < 500
    ) {
      throw new Error("Minimum sync interval is 500ms");
    }
    // Create the RxJS pipeline for handling errors...
    this._observable = this.createObservable().pipe(
      // Increment log count
      operators_1.tap(() => this._countLogged++),
      // Proceed only when `syncInterval` has passed
      operators_1.bufferTime(this._options.syncInterval),
      // Filter out any empty logs
      operators_1.filter(logs => !!logs.length)
    );
    // Subscribe to the observable and process logs
    // TODO - this is entirely for testing right now!
    // TODO - add _real_ logging
    this._subscription = this._observable.subscribe(logs => {
      // TODO remove this block-- it's for testing only!
      setTimeout(() => {
        this._countSynced += logs.length;
      }, 2000);
    });
  }
  /**
   * Number of entries logged
   *
   * @returns number
   */
  get logged() {
    return this._countLogged;
  }
  /**
   * Number of log entries synced with Timber.io
   *
   * @returns number
   */
  get synced() {
    return this._countSynced;
  }
  /**
   * Creates an RxJS Observable for listening to log events
   *
   * @returns number
   */
  createObservable() {
    return rxjs_1.fromEvent(this._event, "log").pipe(
      // Add timestamp if it doesn't exist on the log entry
      operators_1.map(log => Object.assign({ date: new Date() }, log))
    );
  }
  /**
   * Log an entry, to be synced with Timber.io
   *
   * @param log - Log entry
   */
  log(log) {
    this._event.emit("log", log);
  }
}
// noinspection JSUnusedGlobalSymbols
exports.default = Timber;
//# sourceMappingURL=index.js.map
