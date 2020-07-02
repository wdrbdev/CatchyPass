const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config");

const app = express();

/*
 * Middleware
 */
app.use(cors()); // Connect to different ports such as React
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello there!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
