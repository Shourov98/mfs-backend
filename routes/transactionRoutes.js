const express = require("express");
const router = express.Router();
const { sendMoney, 
  getTransactionHistory } = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send-money", protect, sendMoney);
router.get("/transaction/:id", protect, getTransactionHistory);


module.exports = router;
