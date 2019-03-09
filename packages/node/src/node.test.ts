import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { PassThrough, Writable } from "stream";

import nock from "nock";
import { ITimberLog, LogLevel } from "@timberio/types";

import { Node } from "./node";

/**
 * Create a log with a random string / current date
 */
function getRandomLog(message: string): Partial<ITimberLog> {
  return {
    dt: new Date(),
    level: LogLevel.Info,
    message,
  };
}

describe("node tests", () => {
  it("should echo log if timber sends 20x status code", async () => {
    const source = "someSource";
    nock("https://logs.timber.io")
      .post(`/sources/${source}/frames`)
      .reply(201);

    const message: string = String(Math.random());
    const expectedLog = getRandomLog(message);
    const node = new Node("valid api key", source);
    const echoedLog = await node.log(message);
    expect(echoedLog.message).toEqual(expectedLog.message);
  });

  it("should throw error if timber sends non 200 status code", async () => {
    const source = "someSource";
    nock("https://logs.timber.io")
      .post(`/sources/${source}/frames`)
      .reply(401);

    const node = new Node("invalid api key", "someSource");
    const message: string = String(Math.random);
    await expect(node.log(message)).rejects.toThrow();
  });

  it("should enable piping logs to a writable stream", async () => {
    // Create a writable stream
    const writeStream = new Writable({
      write(
        chunk: any,
        encoding: string,
        callback: (error?: Error | null) => void,
      ): void {
        // Will be a buffered JSON string -- parse
        const log: ITimberLog = JSON.parse(chunk.toString());

        // Expect the log to match the message
        expect(log.message).toEqual(message);

        callback();
      },
    });

    // Fixtures
    const timber = new Node("test", "someSource");
    timber.pipe(writeStream);

    const message = "This should be streamed";

    // Mock the sync method by simply returning the same logs
    timber.setSync(async logs => logs);

    // Fire a log event
    await timber.log(message);
  });

  it("should pipe logs to a writable file stream", async done => {
    // Create a temporary file name
    const temp = path.join(os.tmpdir(), `timber_${Math.random()}`);

    // Create a write stream based on that temp file
    const writeStream = fs.createWriteStream(temp);

    // Create a Pass-through stream, to ensure multiplexing works
    const passThrough = new PassThrough();

    // Pass write stream to Timber
    const timber = new Node("test", "someSource");
    timber.pipe(passThrough).pipe(writeStream);

    // Mock the sync method by simply returning the same logs
    timber.setSync(async logs => logs);

    // Create messages
    const messages = ["message 1", "message 2"];

    // Log messages
    await Promise.all(messages.map(msg => timber.log(msg)));

    writeStream.on("finish", () => {
      // Get the stored data, and translate back to JSON
      const data = fs
        .readFileSync(temp)
        .toString()
        .trim()
        .split("\n")
        .map(line => JSON.parse(line));

      // Messages should match
      for (let i = 0; i < messages.length; i++) {
        expect(data[i].message).toEqual(messages[i]);
      }

      done();
    });

    writeStream.end();
  });
});
