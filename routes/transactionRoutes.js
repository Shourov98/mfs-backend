const express = require("express");
const router = express.Router();
const { sendMoney, 
  getTransactionHistory,
  cashIn,
  cashOut } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send-money", protect, sendMoney);
router.get("/transaction/:id", protect, getTransactionHistory);
router.post("/cash-in", protect, cashIn);
router.post("/cash-out", protect, cashOut);




module.exports = router;
