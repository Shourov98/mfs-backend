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
    const { page = 1, limit = 10 } = req.query;

    if (req.user._id.toString() !== id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const query = {
      $or: [{ sender: id }, { receiver: id }],
    };

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const cashIn = async (req, res) => {
  try {
    const { receiverMobileNumber, amount, pin } = req.body;

    if (!receiverMobileNumber || !amount || !pin) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (req.user.role !== "Agent") {
      return res.status(403).json({ message: "Only agents can perform cash-in." });
    }

    const agent = req.user;

    const isPinCorrect = await require("bcryptjs").compare(pin, agent.pin);
    if (!isPinCorrect) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const receiver = await User.findOne({ mobileNumber: receiverMobileNumber, role: "User" });
    if (!receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    if (agent.balance < amount) {
      return res.status(400).json({ message: "Agent has insufficient balance." });
    }

    agent.balance -= amount;
    receiver.balance += amount;

    await agent.save();
    await receiver.save();

    const txn = await Transaction.create({
      type: "CASH_IN",
      sender: agent._id,
      receiver: receiver._id,
      amount,
      fee: 0
    });

    res.status(201).json({
      message: "Cash-in successful",
      transactionId: txn.transactionId,
      receiver: {
        name: receiver.name,
        mobileNumber: receiver.mobileNumber
      },
      amount
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cashOut = async (req, res) => {
  try {
    const { agentMobileNumber, amount, pin } = req.body;

    if (!agentMobileNumber || !amount || !pin) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive." });
    }

    const user = req.user;

    if (user.role !== "User") {
      return res.status(403).json({ message: "Only users can perform cash-out." });
    }

    const isPinCorrect = await require("bcryptjs").compare(pin, user.pin);
    if (!isPinCorrect) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const agent = await User.findOne({ mobileNumber: agentMobileNumber, role: "Agent", status: "Active" });
    if (!agent) {
      return res.status(404).json({ message: "Agent not found or not approved." });
    }

    const fee = parseFloat((amount * 0.015).toFixed(2));
    const total = amount + fee;

    if (user.balance < total) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const admin = await User.findOne({ role: "Admin" });

    // Balance updates
    user.balance -= total;
    agent.balance += amount;
    agent.income += parseFloat((amount * 0.01).toFixed(2));
    admin.income += parseFloat((amount * 0.005).toFixed(2));
    admin.income += 5; // Additional fixed 5 Taka per operation

    await user.save();
    await agent.save();
    await admin.save();

    const txn = await Transaction.create({
      type: "CASH_OUT",
      sender: user._id,
      receiver: agent._id,
      amount,
      fee,
    });

    res.status(201).json({
      message: "Cash-out successful",
      transactionId: txn.transactionId,
      amount,
      fee,
      agent: {
        name: agent.name,
        mobileNumber: agent.mobileNumber,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const { role, balance, income } = req.user;

    const response = {
      balance
    };

    if (role === "Agent") {
      response.income = income;
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { sendMoney, getTransactionHistory, cashIn, cashOut, getBalance };
