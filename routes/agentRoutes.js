const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { cashRequest, withdrawRequest } = require("../controllers/agentController");

router.post("/agent/cash-request", protect, cashRequest);
router.post("/agent/withdraw-request", protect, withdrawRequest);



module.exports = router;