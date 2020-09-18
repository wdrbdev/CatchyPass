const mongoose = require("mongoose");
const Result = mongoose.model("Result");
const config = require("../config");

module.exports = (app, { client, subscriber, publisher }) => {
  app.post("/keywords", async (req, res) => {
    const { keywords } = req.body;
    const result = new Result({
      keywords,
    });
    try {
      // Save the current data
      await result.save();

      // Publish keywords input to message queue
      publisher.publish(
        "keywords",
        JSON.stringify({
          _id: result._id,
          keywords,
        })
      );
      console.log(`Publishing keywords ${keywords}`);
      res.json(result);
    } catch (err) {
      res.sendStatus(400, err);
    }
  });
};
