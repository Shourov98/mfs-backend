const Transaction = require("../models/Transaction");
const User = require("../models/User");

const sendMoney = async (req, res) => {
  try {
    const { receiverMobileNumber, amount, pin } = req.body;

    if (!receiverMobileNumber || !amount || !pin) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount < 50) {
      return res.status(400).json({ message: "Minimum amount is 50 Taka." });
    }

    const sender = req.user;

    const isPinCorrect = await require("bcryptjs").compare(pin, sender.pin);
    if (!isPinCorrect) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const receiver = await User.findOne({ mobileNumber: receiverMobileNumber });
    if (!receiver || receiver._id.equals(sender._id)) {
      return res.status(404).json({ message: "Receiver not found or invalid." });
    }

    const fee = amount > 100 ? 5 : 0;
    const total = amount + fee;

    if (sender.balance < total) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Adjust balances
    sender.balance -= total;
    receiver.balance += amount;

    // Admin fee income
    const admin = await User.findOne({ role: "Admin" });
    admin.income += fee;

    // Save changes
    await sender.save();
    await receiver.save();
    await admin.save();

    // Save transaction
    const txn = await Transaction.create({
      type: "SEND",
      sender: sender._id,
      receiver: receiver._id,
      amount,
      fee,
    });

    res.status(201).json({
      message: "Send Money successful",
      transactionId: txn.transactionId,
      amount,
      fee,
      receiver: {
        name: receiver.name,
        mobileNumber: receiver.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow the owner to view their history
    if (req.user._id.toString() !== id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const transactions = await Transaction.find({
      $or: [{ sender: id }, { receiver: id }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { sendMoney, getTransactionHistory };
