/**
 * Admin Controller
 * Handles system administration operations
 */
const { User, AdminLog } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    const stats = {
      totalUsers: await User.count(),
      activeUsers: await User.count({ where: { is_active: true } }),
      pendingApprovals: await User.count({ where: { is_verified: false } })
    };
    
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update({ is_verified: true, is_active: true });
    
    res.json({
      success: true,
      message: 'User approved successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update({ is_active: false });
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Platform analytics'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemLogs = async (req, res, next) => {
  try {
    const logs = await AdminLog.findAll({ limit: 100, order: [['created_at', 'DESC']] });
    
    res.json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};