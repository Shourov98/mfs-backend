// File: controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, mobileNumber, email, pin, nid, role } = req.body;

    if (!name || !mobileNumber || !email || !pin || !nid || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === "Admin") {
      return res.status(403).json({ message: "Admin registration not allowed" });
    }

    const existingUser = await User.findOne({
      $or: [{ mobileNumber }, { email }, { nid }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = new User({
      name,
      mobileNumber,
      email,
      pin: hashedPin,
      nid,
      role,
      balance: role === "User" ? 40 : role === "Agent" ? 100000 : 0,
      status: role === "Agent" ? "Pending" : "Active",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    newUser.currentToken = token;
    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        balance: newUser.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, pin } = req.body;

    const user = await User.findOne({
      $or: [
        { mobileNumber: identifier },
        { email: identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const pinMatch = await bcrypt.compare(pin, user.pin);
    if (!pinMatch) {
      return res.status(401).json({ message: "Invalid PIN." });
    }

    // ✅ Prevent login if status is not 'Active'
    if (user.status === "Pending") {
      return res.status(403).json({ message: "Account is not approved." });
    }

    if(user.status === "Blocked") {
      return res.status(403).json({message: "Account is blocked."})
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.currentToken = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role,
        status: user.status,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    user.currentToken = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
