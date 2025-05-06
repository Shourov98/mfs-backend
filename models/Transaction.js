// File: models/Transaction.js

const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  type: {
    type: String,
    enum: ["SEND", "CASH_IN", "CASH_OUT"],
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  fee: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
