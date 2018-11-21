import Base from "./lib/base";

class NodeLogger extends Base {
  public constructor(apiKey: string) {
    super(apiKey);
    console.log("Hello from Node.js!");

    this.setSync(async log => log);
  }
}

export default NodeLogger;
