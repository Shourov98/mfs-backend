const User = require("../models/User");

const getPendingAgents = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const pendingAgents = await User.find({ role: "Agent", status: "Pending" })
      .select("-pin -nid -currentToken");

    res.status(200).json({ agents: pendingAgents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAgentStatus = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const agent = await User.findById(id);
    if (!agent || agent.role !== "Agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.status = action === "approve" ? "Active" : "Blocked";
    await agent.save();

    res.status(200).json({ message: `Agent ${action}d successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCashRequests = async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });

  const agents = await User.find({ role: "Agent", "cashRequests.status": "Pending" })
    .select("name mobileNumber cashRequests");

  res.status(200).json({ agents });
};

const approveCashRequest = async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });

  const { id } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const agent = await User.findById(id);
  if (!agent || agent.role !== "Agent") {
    return res.status(404).json({ message: "Agent not found" });
  }

  const request = agent.cashRequests.find(r => r.status === "Pending");
  if (!request) return res.status(404).json({ message: "No pending request" });

  request.status = action === "approve" ? "Approved" : "Rejected";

  if (action === "approve") {
    agent.balance += 100000;
  }

  await agent.save();

  res.status(200).json({ message: `Request ${action}d successfully.` });
};

const getWithdrawRequests = async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });

  const agents = await User.find({ role: "Agent", "withdrawRequests.status": "Pending" })
    .select("name mobileNumber withdrawRequests income");

  res.status(200).json({ agents });
};

const approveWithdrawRequest = async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });

  const { id } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const agent = await User.findById(id);
  if (!agent || agent.role !== "Agent") {
    return res.status(404).json({ message: "Agent not found" });
  }

  const request = agent.withdrawRequests.find(r => r.status === "Pending");
  if (!request) return res.status(404).json({ message: "No pending withdraw request" });

  request.status = action === "approve" ? "Approved" : "Rejected";

  if (action === "approve") {
    agent.balance += agent.income;
    agent.income = 0;
  }

  await agent.save();

  res.status(200).json({ message: `Withdraw request ${action}d successfully.` });
};

const getBlockedUsers = async (req, res) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied." });

  const blocked = await User.find({ status: "Blocked" }).select("name mobileNumber email");
  res.status(200).json({ blocked });
};

const blockUser = async (req, res) => {
  const { mobileNumber } = req.body;
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied." });

  const user = await User.findOne({ mobileNumber });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.status = "Blocked";
  await user.save();

  res.status(200).json({ message: "User blocked successfully." });
};

const unblockUser = async (req, res) => {
  const { mobileNumber } = req.body;
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied." });

  const user = await User.findOne({ mobileNumber });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.status = "Active";
  await user.save();

  res.status(200).json({ message: "User unblocked successfully." });
};

module.exports = {
  getPendingAgents,
  updateAgentStatus,
  getCashRequests,
  approveCashRequest,
  getWithdrawRequests,
  approveWithdrawRequest,
  blockUser,
  unblockUser,
  getBlockedUsers,
};
