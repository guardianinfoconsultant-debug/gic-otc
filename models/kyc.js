const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  idImage: String,
  selfieImage: String,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Kyc", kycSchema);
