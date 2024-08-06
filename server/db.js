const db = require("pg");
const Sequelize = require("sequelize");

require("dotenv").config();
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
