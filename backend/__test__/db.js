const { Sequelize } = require("sequelize");

// Replace DB_NAME, DB_USER, DB_PASSWORD, and DB_HOST with your PostgreSQL database credentials
const sequelize = new Sequelize(
  "postgres://postgres:123456@localhost:5432/postgres",
  {
    dialect: "postgres",
  }
);

module.exports = sequelize;
