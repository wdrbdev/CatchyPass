const mongoose = require("mongoose");
const Result = mongoose.model("Result");
const config = require("../config");

module.exports = (app) => {
  app.post("/result", async (req, res) => {
    const result = await Result.findById(req.body._id);
    res.json(result);
  });
};
