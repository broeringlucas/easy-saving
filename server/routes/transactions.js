const express = require("express");
const router = express.Router();
const {
  getTransactionsByUser,
  createTransaction,
  deleteTransaction,
  getMonthlySummary,
} = require("../controllers/transactions");

const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get("/user/:user_id", AuthMiddleware, getTransactionsByUser);
router.get("/summary/monthly/:user_id", AuthMiddleware, getMonthlySummary);
router.post("/", AuthMiddleware, createTransaction);
router.delete("/:id", AuthMiddleware, deleteTransaction);

module.exports = router;
