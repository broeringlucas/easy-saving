const Sequelize = require("sequelize");
const db = require("../db.js");
const User = require("./user");
const Category = require("./category.js");

const Transaction = db.define("transaction", {
  transaction_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  time: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1]],
    },
    comment: "0: despesa, 1: receita",
  },
});

Transaction.belongsTo(User, {
  constraints: true,
  foreignKey: "user_id",
  allowNull: false,
});

Transaction.belongsTo(Category, {
  constraints: true,
  foreignKey: "category_id",
  allowNull: false,
});

module.exports = Transaction;
