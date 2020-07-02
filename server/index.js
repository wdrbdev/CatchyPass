const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Import configurations
const config = require("./config");

const app = express();

/*
 * Middlewares
 */
app.use(cors()); // Connect to different ports such as React
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello there!");
});

/*
 * Initialize Redis
 */
const redis = require("redis");
const client = redis.createClient({
  host: config.redisHost,
  port: config.redisPort,
  retry_strategy: () => 1000,
});
// SUB/PUB mode for workers receiving regular commands
const subscriber = redis.duplicate();
const publisher = redis.duplicate();
const redisObj = {
  client,
  subscriber,
  publisher,
};

/*
 * Initialize MongoDB
 */
mongoose.connect(
  `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPORT}`
);

// Load schema
require("./models/Password.js");
require("./models/Sentence.js");

/*
 * Register route handlers
 */
require("./routes/dbRoutes")(app);
require("./routes/mqRoutes")(app, redisObj);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
