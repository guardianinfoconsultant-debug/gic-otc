const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 10000,
  },
  role: {
    type: String,
    default: "user", // user / admin
  },
  kycStatus: {
    type: String,
    default: "pending", // pending / approved / rejected
  },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
