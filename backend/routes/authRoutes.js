const express = require("express");
const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ========================
// SIGNUP API
// ========================

router.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      adminKey
    } = req.body;

    // Password validation
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordPattern.test(password)) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters and contain a number"
      });

    }

    // Check duplicate email
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message:
          "Email already registered"
      });

    }

    // ADMIN SECURITY CHECK
    if (role === "admin") {

      if (adminKey !== "ADMIN123") {

        return res.status(403).json({
          message:
            "Invalid admin secret key"
        });

      }

    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({

      name,
      email,
      password: hashedPassword,
      role

    });

    await user.save();

    res.json({
      message: "User created successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// ========================
// GET ALL USERS (for dropdown)
// ========================

router.get("/users", async (req, res) => {

  try {

    const users =
      await User.find({
        role: "user"
      });

    res.json(users);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// ========================
// LOGIN API
// ========================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
      role
    } = req.body;

    // Find user
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    // Check password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid password"
      });

    }

    // Role validation
    if (user.role !== role) {

      return res.status(403).json({
        message:
          "Invalid role selected"
      });

    }

    // Generate JWT token
    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role
        },
        "secret123",
        {
          expiresIn: "1d"
        }
      );

    res.json({

      token,
      role: user.role

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;