/**
 * MariaDB Database Configuration using Sequelize ORM
 * Supports connection pooling for production workloads
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: '+02:00', // Lusaka is UTC+2
      connectTimeout: 60000,
    },
    pool: {
      max: 10,        // Maximum connections in pool
      min: 0,         // Minimum connections in pool
      acquire: 60000, // Maximum time to get connection
      idle: 10000     // Maximum idle time
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MariaDB Connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to MariaDB:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };