import Logger from "./index";

const logger = new Logger("testing");

function print() {
  console.log(`Logged: ${logger.logged}`);
  console.log(`Synced: ${logger.synced}`);
}

(async () => {
  print();
  void logger.log({
    message: "This is a test!"
  });
  print();

  setTimeout(() => {
    print();
  }, 3000);
})();
