const { Sequelize } = require("sequelize");
const { PostgresDialect } = require("@sequelize/postgres");

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: PostgresDialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);
