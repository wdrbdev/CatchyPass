const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
  keywords: [String],
  description: String,
  isSeed: { type: Boolean, default: false },
  startTime: { type: Date, default: Date.now() },
  endTime: Date,
  resultSentence: { type: String, default: "" },
  isCompleted: { type: Boolean, default: false },
  status: String,
  _password: { type: mongoose.Schema.Types.ObjectId, reference: "Password" },
});

mongoose.model("Sentence", sentenceSchema);
