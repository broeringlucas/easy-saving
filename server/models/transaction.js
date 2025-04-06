const Sequelize = require("sequelize");
const db = require("../db.js");
const User = require("./user");
const Category = require("./category.js");

const Transaction = db.define(
  "transaction",
  {
    transaction_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
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
  },
  { timestamps: false }
);

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
