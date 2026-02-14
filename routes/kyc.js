const router = require("express").Router();
const multer = require("multer");
const Kyc = require("../models/Kyc");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", auth, upload.fields([
  { name: "idImage" },
  { name: "selfieImage" }
]), async (req, res) => {

  await Kyc.create({
    user: req.user._id,
    idImage: req.files.idImage[0].filename,
    selfieImage: req.files.selfieImage[0].filename
  });

  res.json({ message: "KYC submitted" });
});

module.exports = router;
