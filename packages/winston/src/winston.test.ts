import winston, { LogEntry } from "winston";
import { Timber } from "@timberio/node";
import { LogLevel } from "@timberio/types";

import { TimberTransport } from "./winston";

async function testLevel(level: string, logLevel: LogLevel) {
  // Sample log
  const log: LogEntry = {
    level,
    message: "Something to do with something"
  };

  // Timber fixtures
  const timber = new Timber("test");
  timber.setSync(async logs => {
    // Should be exactly one log
    expect(logs.length).toBe(1);

    // Message should match
    expect(logs[0].message).toBe(log.message);

    // Log level should be 'info'
    expect(logs[0].level).toBe(logLevel);

    return logs;
  });

  // Create a Winston logger
  const logger = winston.createLogger({
    level,
    transports: [new TimberTransport(timber)]
  });

  // Log it!
  return logger.log(log);
}

describe("Winston logging tests", () => {
  it("should log at the 'debug' level", async () => {
    return testLevel("debug", LogLevel.Debug);
  });

  it("should log at the 'info' level", async () => {
    return testLevel("info", LogLevel.Info);
  });

  it("should log at the 'warn' level", async () => {
    return testLevel("warn", LogLevel.Warn);
  });

  it("should log at the 'error' level", async () => {
    return testLevel("error", LogLevel.Error);
  });

  it("should default to 'info' level when using custom logging", async () => {
    return testLevel("silly", LogLevel.Info);
  });
});
