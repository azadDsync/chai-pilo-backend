const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const authRoutes = express.Router();

authRoutes.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        { userId: user.id, email: user.email }, // Include email in token
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ token, user: { id: user.id, email: user.email } }); // Return user info
      
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

authRoutes.post(
  "/login",
  [
    check("email", "Valid email required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ token, user: { id: user.id, email: user.email } });
      
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = authRoutes;

// app.post("/entries", authMiddleware, async (req, res) => {
//   try {
//     const { date, doodh_laya, bartan_dhoya } = req.body;
//     let entry = await Entry.findOne({ date });
//     if (!entry) {
//       entry = new Entry({ date, doodh_laya: "", bartan_dhoya: "" });
//     }
//     if (doodh_laya) entry.doodh_laya = doodh_laya;
//     if (bartan_dhoya) entry.bartan_dhoya = bartan_dhoya;
//     await entry.save();
//     res.status(201).json(entry);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
