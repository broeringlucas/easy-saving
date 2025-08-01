const Sequelize = require("sequelize");

const db = require("../config/db");
const User = require("./user");
const Category = require("./category.js");

const Transaction = db.define(
  "tb_transaction",
  {
    transaction_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: Sequelize.DATE,
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
      comment: "0: expense, 1: income",
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
