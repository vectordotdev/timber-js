import Logger from "./index";

const add = 100;
const logger = new Logger("testing");

const promises = [];

console.time("Added");

for (let i = 0; i < add; i++) {
  promises.push(
    logger.log({
      message: "Testing"
    })
  );
}

console.timeEnd("Added");

function print() {
  console.log(`Logged: ${logger.logged}`);
  console.log(`Synced: ${logger.synced}`);
}

(async () => {
  print();
  console.time("Added2");
  await Promise.all(promises);
  console.timeEnd("Added2");
  print();
})();
