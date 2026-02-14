require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= MONGODB ========= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

/* ========= STATIC FILES ========= */
app.use(express.static(path.join(__dirname, "public")));

/* ========= API ROUTES ========= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/kyc", require("./routes/kyc"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/settings", require("./routes/settings"));

/* ========= DEFAULT ROUTE ========= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ========= PORT ========= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
