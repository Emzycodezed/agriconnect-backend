const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/database');
const sequelize = dbConfig.sequelize;

const models = { sequelize, Sequelize, DataTypes };

// Load models using factory pattern (match your existing pattern)
const modelFiles = [
  'User',
  'Farmer',
  'FarmerProfile',
  'Buyer',
  'BuyerProfile',
  'Supplier',
  'SupplierProfile',
  'Order',
  'Payment',
  'Product',
  'AdminLog',
  'AuditLog',
  'Market',
  'Message',
  'Transaction'
];

modelFiles.forEach(name => {
  try {
    const Model = require(`./${name}`)(sequelize, DataTypes);
    models[name] = Model;
  } catch (e) { /* skip missing */ }
});

module.exports = models;
