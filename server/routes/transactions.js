const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  getTransactionsByUser,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions");

router.get("/", getTransactions);
router.get("/user/:user_id", getTransactionsByUser);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
