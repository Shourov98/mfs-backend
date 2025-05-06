const express = require("express");
const router = express.Router();
const { sendMoney, 
  getTransactionHistory,
  cashIn,
  cashOut,
  getBalance } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send-money", protect, sendMoney);
router.get("/transaction/:id", protect, getTransactionHistory);
router.post("/cash-in", protect, cashIn);
router.post("/cash-out", protect, cashOut);
router.get("/balance", protect, getBalance);


module.exports = router;
