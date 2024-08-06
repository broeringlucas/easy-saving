const Sequelize = require("sequelize");
const db = require("../db.js");

const Category = db.define("category", {
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

module.exports = Category;
