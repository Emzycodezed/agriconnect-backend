/**
 * Buyer Controller
 * Handles buyer-specific operations
 */
const { Crop, Order, Product } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Buyer dashboard data'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.browseCrops = async (req, res, next) => {
  try {
    const crops = await Crop.findAll({ 
      where: { is_available_for_sale: true },
      include: ['farmer']
    });
    
    res.json({
      success: true,
      data: { crops }
    });
  } catch (error) {
    next(error);
  }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const productId = Number(product_id);
    const requestedQuantity = Number(quantity);

    if (!productId || !requestedQuantity || requestedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'product_id and a valid quantity are required'
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const unitPrice = Number(product.price || 0);
    const order = await Order.create({
      product_id: productId,
      buyer_id: req.user.id,
      quantity: String(requestedQuantity),
      total_price: unitPrice * requestedQuantity,
      status: 'pending'
    });

    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: Product, as: 'product' }]
    });
    
    res.status(201).json({
      success: true,
      data: { order: createdOrder || order }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { buyer_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, buyer_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};
