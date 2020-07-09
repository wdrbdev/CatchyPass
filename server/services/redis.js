const redis = require("redis");
const config = require("../config");

module.exports = () => {
  const client = redis.createClient({
    host: config.redisHost,
    port: config.redisPort,
    retry_strategy: () => 1000,
  });

  // SUB/PUB mode for workers
  // Note: without duplication subscriber/publisher cannot CRUD for redis client
  const subscriber = client.duplicate();
  const publisher = client.duplicate();

  subscriber.subscribe("sentence");
  subscriber.on("message", (channel, message) => {
    // TODO continuously receiving message and processing it
    // if (channel === "sentence") {
    //   console.log(`receiving message from python: ${message}`);
    // }
  });

  // Test only (for publishing message)
  // setTimeout(() => {
  //   const kwList = ["kw1", "kw2", "k2"];
  //   for (let i = 1; i <= 10; i++) {
  //     setTimeout(() => {
  //       publisher.publish(
  //         "keywords",
  //         JSON.stringify({ keywords: kwList, timeStamp: i * 2 })
  //       );
  //       console.log("keywords published");
  //     }, 8000);
  //   }
  // }, 1000);

  // Return all redis objects
  const redisObj = {
    client,
    subscriber,
    publisher,
  };
  return redisObj;
};
