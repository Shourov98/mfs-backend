const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  getPendingAgents,
  updateAgentStatus, 
  getCashRequests, 
  approveCashRequest,
  getWithdrawRequests,
  approveWithdrawRequest,
  getBlockedUsers,
  blockUser,
  unblockUser,
  } = require("../controllers/adminController");


router.get("/admin/agent-approval", protect, getPendingAgents);
router.post("/admin/agent-approval/:id", protect, updateAgentStatus);
router.get("/admin/cash-approval", protect, getCashRequests);
router.post("/admin/cash-approval/:id", protect, approveCashRequest);
router.get("/admin/withdraw-request", protect, getWithdrawRequests);
router.post("/admin/withdraw-request/:id", protect, approveWithdrawRequest);
router.get("/admin/blocked-users", protect, getBlockedUsers);
router.post("/admin/block-user", protect, blockUser);
router.post("/admin/unblock-user", protect, unblockUser);



module.exports = router;
