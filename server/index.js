const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Import configurations and setup
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
 * Initialize MongoDB
 */
const redisObj = require("./services/redis")();

/*
 * Initialize MongoDB
 */
mongoose.connect(
  `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPORT}`,
  {
    useNewUrlParser: true,
  }
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
