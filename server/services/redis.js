const redis = require("redis");
const mongoose = require("mongoose");
const config = require("../config");
const sent2pass = require("./sent2pass");
const Sentence = mongoose.model("Sentence");
const Password = mongoose.model("Password");

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
  subscriber.on("message", async (channel, message) => {
    switch (channel) {
      case "sentence":
        console.log(message);
        const { _id, status, resultSentence } = JSON.parse(message);
        const sentence = await Sentence.findByIdAndUpdate(
          { _id },
          {
            $set: {
              resultSentence,
              status,
              endTime: Date.now(),
              isCompleted: true,
            },
          }
        );
        console.log(sentence);
        publisher.publish("password", JSON.stringify(sentence));
        break;
      case "password":
        const { sentenceResult } = JSON.parse(message);
        const resultPassword = sent2pass(sentenceResult);

        const password = new Password({
          $set: {
            resultPassword,
            isCompleted: true,
            status: "testing",
          },
        });
        try {
          // Save the current data
          await password.save();

          await Sentence.findByIdAndUpdate(
            { _id: sentenceResult._id },
            {
              $set: {
                _password: password._id,
              },
            }
          );

          res.send(200);
        } catch (err) {
          res.send(400, err);
        }
        break;
    }
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
