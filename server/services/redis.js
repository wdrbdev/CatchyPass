const redis = require("redis");
const mongoose = require("mongoose");
const config = require("../config");
const sent2pass = require("./sent2pass");
const Result = mongoose.model("Result");

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
  subscriber.subscribe("password");
  subscriber.on("message", async (channel, message) => {
    if (channel === "sentence") {
      let { _id, status, textResult } = JSON.parse(message);
      let sentence = await Result.findByIdAndUpdate(
        _id,
        {
          $set: {
            textResult,
            status,
          },
        },
        { new: true }
      );
      publisher.publish("password", JSON.stringify(sentence));
    }
  });
  subscriber.on("message", async (channel, message) => {
    if (channel === "password") {
      let { _id, textResult, keywords } = JSON.parse(message);
      let passwordResult = [
        sent2pass(textResult, keywords, "", false), // Only upper case
        sent2pass(textResult, keywords), // Upper case and number
        sent2pass(textResult, keywords, "."), // Upper case, number and special characters
      ];
      await Result.findByIdAndUpdate(
        _id,
        {
          $set: {
            passwordResult,
            endTime: Date.now(),
          },
        },
        { new: true }
      );
    }
  });

  // Return all redis objects
  const redisObj = {
    client,
    subscriber,
    publisher,
  };
  return redisObj;
};
