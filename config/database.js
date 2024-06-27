const { Sequelize } = require('sequelize');

const Database = process.env.DATABASE || "seep";
const User = process.env.USER || "Ander";
const Password = process.env.PASSWORD || "Ab%12345";
const Host = process.env.DBHOST || 'seep-db.mysql.database.azure.com';

const sequelize = new Sequelize(Database, User, Password, {
  host: Host,
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
