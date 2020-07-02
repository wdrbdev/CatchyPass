const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  description: String,
  isSeed: { type: Boolean, default: false },
  resultPassword: String,
  isCompleted: { type: Boolean, default: false },
  status: String,
});

mongoose.model("password", passwordSchema);
