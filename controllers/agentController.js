const { model } = require("mongoose");

const cashRequest = async (req, res) => {
  try {
    if (req.user.role !== "Agent") {
      return res.status(403).json({ message: "Only agents can request cash." });
    }

    const hasPending = req.user.cashRequests.some(r => r.status === "Pending");
    if (hasPending) {
      return res.status(400).json({ message: "You already have a pending request." });
    }

    req.user.cashRequests.push({ status: "Pending" });
    await req.user.save();

    res.status(201).json({ message: "Cash request submitted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const withdrawRequest = async (req, res) => {
  try {
    if (req.user.role !== "Agent") {
      return res.status(403).json({ message: "Only agents can request withdraw." });
    }

    const hasPending = req.user.withdrawRequests.some(r => r.status === "Pending");
    if (hasPending) {
      return res.status(400).json({ message: "You already have a pending withdraw request." });
    }

    if (req.user.income <= 0) {
      return res.status(400).json({ message: "No income available to withdraw." });
    }

    req.user.withdrawRequests.push({ status: "Pending" });
    await req.user.save();

    res.status(201).json({ message: "Withdraw request submitted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  cashRequest,
  withdrawRequest,
}