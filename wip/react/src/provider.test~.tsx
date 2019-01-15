import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Timber } from "@timberio/node";

import { TimberProvider } from "./provider";

const exception = "Test exception";

class ThrowError extends React.Component {
  componentWillMount() {}
  public render() {
    throw new Error(exception);
    return <h1>This is a test</h1>;
  }
}

describe("TimberProvider tests", () => {
  it("should catch exception in React children", async done => {
    // Create a Timber client
    const timber = new Timber("test");

    // Capture the error inside the sync method
    timber.setSync(async logs => {
      // Logs should equal one -- i.e. one error
      expect(logs.length).toBe(1);

      // Call test completion callback
      done();

      // Return logs to satisfy `setSync` type
      return logs;
    });

    // React chain
    const Chain = () => (
      <TimberProvider logger={timber}>
        <ThrowError />
      </TimberProvider>
    );

    // Render - should throw the error!
    try {
      ReactDOMServer.renderToString(<Chain />);
    } catch (e) {}
  });
});
