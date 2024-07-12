const { Sequelize } = require('sequelize');

const Database = process.env.DATABASE || "seep";
const User = process.env.USER || "root";
const Password = process.env.PASSWORD || "root";
const Host = process.env.DBHOST || 'seep-db-server.mysql.database.azure.com';

const sequelize = new Sequelize("seep", "root", "root", {
  host: 'localhost',
  dialect: 'mysql',
  port: process.env.PORTDB || 3306,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully');
  } catch (err) {
    console.error('Unable to connect to database', err);
  }
}

module.exports = { sequelize, testConnection };
