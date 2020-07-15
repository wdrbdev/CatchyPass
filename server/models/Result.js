const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  keywords: [String],
  startTime: { type: Date, default: Date.now() },
  endTime: Date,
  sentenceResult: { type: String, default: "" },
  passwordResult: { type: String, default: "" },
  isSeed: { type: Boolean, default: false },
  status: String,
  description: String,
});

mongoose.model("Result", resultSchema);
