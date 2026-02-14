const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  gelPrice: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Price", priceSchema);
