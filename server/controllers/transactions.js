const db = require("../models/transaction.js");
const Category = require("../models/category.js");

const getTransactions = async (req, res) => {
  try {
    const transactions = await db.findAll({
      include: Category,
    });

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getTransactionsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const transactions = await db.findAll({
      where: {
        user_id: user_id,
      },
      include: Category,
    });

    return res.status(200).send(transactions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await db.findByPk(id);
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, description, category, user, type } = req.body;

    await db.create({
      amount: amount,
      description: description,
      category_id: category,
      user_id: user,
      type: type,
    });
    return res
      .status(201)
      .send({ message: "Transaction created successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;
    const transaction = await db.findByPk(id);
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }
    transaction.amount = amount;
    transaction.description = description;
    transaction.category = category;
    await transaction.save();
    return res
      .status(200)
      .send({ message: "Transaction updated successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await db.findByPk(id);
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }
    await transaction.destroy();
    return res
      .status(200)
      .send({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionsByUser,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
