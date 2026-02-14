const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/User");
const Price = require("../models/price");
const Log = require("../models/Log");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// CREATE ORDER
router.post("/create", auth, async (req, res) => {
  try {
    if (req.user.kycStatus !== "approved") {
      return res.status(400).json({ message: "KYC not approved" });
    }

    const { type, amount } = req.body;

    const priceDoc = await Price.findOne().sort({ createdAt: -1 });
    if (!priceDoc) {
      return res.status(400).json({ message: "Price not set by admin" });
    }

    const price = priceDoc.gelPrice;
    const total = amount * price;

    if (amount > req.user.limit) {
      return res.status(400).json({ message: "Limit exceeded" });
    }

    if (type === "sell" && req.user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const order = await Order.create({
      user: req.user._id,
      type,
      amount,
      price,
      total,
    });

    await Log.create({
      user: req.user._id,
      action: "Order Created",
      details: `${type} order for ${amount} GEL`,
    });

    res.json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER ORDERS
router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// ADMIN APPROVE ORDER
router.post("/approve/:id", auth, admin, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) return res.json({ message: "Order not found" });

  if (order.type === "buy") {
    order.user.wallet += order.amount;
  } else if (order.type === "sell") {
    order.user.wallet -= order.amount;
  }

  await order.user.save();

  order.status = "completed";
  await order.save();

  await Log.create({
    user: order.user._id,
    action: "Order Completed",
    details: `${order.type} order completed`,
  });

  res.json({ message: "Order completed successfully" });
});

// ADMIN REJECT ORDER
router.post("/reject/:id", auth, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.json({ message: "Order not found" });

  order.status = "rejected";
  await order.save();

  res.json({ message: "Order rejected" });
});

module.exports = router;
