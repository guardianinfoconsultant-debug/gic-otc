const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  action: String,
  details: String,
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
