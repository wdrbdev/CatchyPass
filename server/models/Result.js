const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  keywords: [String],
  textResult: { type: String, default: "" },
  passwordResult: [{ type: String, default: "" }],
  startTime: { type: Date, default: Date.now() },
  endTime: Date,
  isSeed: { type: Boolean, default: false },
  status: String,
  description: String,
});

mongoose.model("Result", resultSchema);
