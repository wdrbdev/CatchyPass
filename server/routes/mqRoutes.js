const mongoose = require("mongoose");
const Sentence = mongoose.model("Sentence");
const Password = mongoose.model("Password");
const config = require("./config");

module.exports = (app, { client, subscriber, publisher }) => {
  app.post("/keywords", async (req, res) => {
    console.log(req.body);
    const { keywords } = req.body;
    const sentence = new Sentence({
      keywords,
    });

    try {
      // Save the current data
      await sentence.save();

      // Publish keywords input to message queue
      publisher.publish(
        "keywords",
        JSON.stringify({
          _id: sentence._id,
          keywords,
        })
      );

      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(400, err);
    }
  });

  app.post("/sentence", (req, res) => {
    // TODO get sentence from db
    // TODO convert sentence to password
    // TODO save password to db
    // TODO respond password generated
  });

  app.get("/test", async (req, res) => {
    publisher.publish(
      "keywords",
      JSON.stringify({
        _id: "sentence._id",
        keywords: ["111", "222", "333", "444", "555"],
      })
    );
    const sentence = new Password({
      status: `test by test route ${Date.now()}`,
    });
    res.send(await Password.find({}));
  });

  app.get("/dbname", (req, res) => {
    const mongoUrl = `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}`;
    const db = mongoose.connect(mongoUrl, { useNewUrlParser: true });
    res.send(db.name);
  });
};
