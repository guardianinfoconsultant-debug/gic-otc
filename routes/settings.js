const router = require("express").Router();
const Settings = require("../models/Settings");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
});

router.post("/update", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { gelPrice } = req.body;
  const settings = await Settings.findOneAndUpdate(
    {},
    { gelPrice },
    { upsert: true, new: true }
  );

  res.json({ message: "Price updated", settings });
});

module.exports = router;
