import Logger from "./index";

const logger = new Logger("testing");

(async () => {
  const log = await logger.log({
    message: "This is a test!"
  });
  console.log(log);
})();
