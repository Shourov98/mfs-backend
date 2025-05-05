// File: models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^01[3-9]\d{8}$/, "Invalid mobile number format"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Invalid email format"],
    },
    pin: {
      type: String,
      required: true,
    },
    nid: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "NID must be 10 digits"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["User", "Agent", "Admin"],
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Blocked"],
      default: "Pending",
    },
    currentToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
