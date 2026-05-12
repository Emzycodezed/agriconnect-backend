/**
 * FRA Controller
 * Handles Food Reserve Agency operations
 */
const { FraRecord, Farmer } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'FRA dashboard data'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.setMaizePrice = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Maize price set successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await FraRecord.findAll({ include: ['farmer'] });
    
    res.json({
      success: true,
      data: { purchases }
    });
  } catch (error) {
    next(error);
  }
};

exports.createPurchase = async (req, res, next) => {
  try {
    const purchase = await FraRecord.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { purchase }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRegisteredFarmers = async (req, res, next) => {
  try {
    const farmers = await Farmer.findAll({ include: ['user'] });
    
    res.json({
      success: true,
      data: { farmers }
    });
  } catch (error) {
    next(error);
  }
};

exports.getNationalStockReport = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'National stock report'
      }
    });
  } catch (error) {
    next(error);
  }
};