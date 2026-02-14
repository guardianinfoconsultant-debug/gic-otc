require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FOLDER =====
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ===== ROUTES IMPORT =====
const authRoutes = require("./routes/auth");
const kycRoutes = require("./routes/kyc");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

// ===== ROUTES USE =====
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ===== DEFAULT ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 GIC OTC Premium Server Running on 5000");
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
