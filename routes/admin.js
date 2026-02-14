const express = require("express");
const router = express.Router();
const Price = require("../models/price");
const User = require("../models/user");
const Order = require("../models/order");
const Log = require("../models/log");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// SET PRICE
router.post("/set-price", auth, admin, async (req, res) => {
  const { gelPrice } = req.body;

  await Price.create({ gelPrice });

  res.json({ message: "Price updated" });
});

// GET ALL USERS
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET ALL ORDERS
router.get("/orders", auth, admin, async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json(orders);
});

// GET LOGS
router.get("/logs", auth, admin, async (req, res) => {
  const logs = await Log.find().populate("user").sort({ createdAt: -1 });
  res.json(logs);
});

module.exports = router;
