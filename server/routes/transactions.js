const express = require("express");
const router = express.Router();
const {
  getTransactionsByUser,
  createTransaction,
  deleteTransaction,
  getMonthlySummary,
} = require("../controllers/transactions");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/user/:user_id", authMiddleware, getTransactionsByUser);
router.get("/summary/monthly/:user_id", authMiddleware, getMonthlySummary);
router.post("/", authMiddleware, createTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
