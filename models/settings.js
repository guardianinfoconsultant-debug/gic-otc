const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  gelPrice: { type: Number, default: 1 }
});

module.exports = mongoose.model("Settings", settingsSchema);
