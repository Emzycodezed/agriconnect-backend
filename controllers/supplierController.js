/**
 * Supplier Controller
 * Handles supplier-specific operations
 */
const { Product, Transaction, Supplier } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Supplier dashboard data'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ where: { user_id: req.user.id } });
    const products = await Product.findAll({ where: { supplier_id: supplier.id } });
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ where: { user_id: req.user.id } });
    
    const product = await Product.create({
      supplier_id: supplier.id,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { orders: [] }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    next(error);
  }
};