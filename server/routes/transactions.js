const express = require("express");
const router = express.Router();
const {
  getTransactionsByUser,
  createTransaction,
  deleteTransaction,
  getMonthlySummary,
} = require("../controllers/transactions");

router.get("/user/:user_id", getTransactionsByUser);
router.get("/summary/monthly/:user_id", getMonthlySummary);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
