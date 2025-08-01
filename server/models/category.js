const Sequelize = require("sequelize");

const User = require("./user");
const db = require("../config/db");

const Category = db.define("tb_categories", {
  category_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Category.belongsTo(User, {
  constraints: true,
  foreignKey: "user_id",
  allowNull: false,
});

module.exports = Category;
