import Base from "./lib/base";
import BrowserLogger from "./entry/browser";
import NodeLogger from "./entry/node";
import { ITimberLog, Pipeline } from "./lib/types";

export {
  /**
   * Types
   */
  ITimberLog,
  Pipeline,
  /**
   * Classes
   */
  Base,
  BrowserLogger,
  NodeLogger
};
