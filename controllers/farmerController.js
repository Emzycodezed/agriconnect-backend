/**
 * Farmer Controller
 * Handles farmer-specific operations
 */
const { Crop, Transaction, Farmer } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    
    // Get counts
    const totalCrops = await Crop.count({ where: { farmer_id: farmer.id } });
    const activeCrops = await Crop.count({ where: { farmer_id: farmer.id, status: 'growing' } });
    const totalSales = await Transaction.sum('total_amount', { where: { farmer_id: farmer.id } }) || 0;
    
    res.json({
      success: true,
      data: {
        stats: {
          totalCrops,
          activeCrops,
          totalSales,
          pendingOrders: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCrops = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    const crops = await Crop.findAll({ where: { farmer_id: farmer.id } });
    
    res.json({
      success: true,
      data: { crops }
    });
  } catch (error) {
    next(error);
  }
};

exports.registerCrop = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    
    const crop = await Crop.create({
      farmer_id: farmer.id,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: { crop }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      data: { crop }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    await crop.update(req.body);
    
    res.json({
      success: true,
      data: { crop }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    const orders = await Transaction.findAll({ where: { farmer_id: farmer.id } });
    
    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ 
      where: { user_id: req.user.id },
      include: ['user']
    });
    
    res.json({
      success: true,
      data: { profile: farmer }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    await farmer.update(req.body);
    
    res.json({
      success: true,
      data: { profile: farmer }
    });
  } catch (error) {
    next(error);
  }
};