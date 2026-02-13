require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");


// REGISTER
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();
        res.json({ message: "User registered successfully ✅" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// LOGIN
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// PROTECTED DASHBOARD
app.get("/api/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to Dashboard 🎉" });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
