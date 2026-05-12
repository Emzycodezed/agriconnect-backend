const { User, FarmerProfile, BuyerProfile, SupplierProfile, AuditLog } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../config/auth');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, phone, email, password, role, province, district, ward, farm_size_ha, crops, company_name, nrc, lat, lng } = req.body;

    // Check if phone exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    // Create location point
    const location = lat && lng ? 
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } : 
      { type: 'Point', coordinates: [28.2833, -15.4167] }; // Default: Lusaka

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      password_hash: password,
      role,
      location,
      lat: lat || -15.4167,
      lng: lng || 28.2833
    });

    // Create role-specific profile
    if (role === 'farmer') {
      await FarmerProfile.create({
        user_id: user.id,
        district,
        ward,
        farm_size_ha: farm_size_ha || 0,
        crops: crops || ''
      });
    } else if (role === 'buyer') {
      await BuyerProfile.create({
        user_id: user.id,
        nrc: nrc || '',
        province,
        district,
        ward,
        location
      });
    } else if (role === 'supplier') {
      await SupplierProfile.create({
        user_id: user.id,
        company_name: company_name || name,
        nrc: nrc || '',
        province,
        district
      });
    }

    // Log to audit
    await AuditLog.create({
      user_id: user.id,
      action: 'user_registered',
      ip: req.ip
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last seen
    user.updated_at = new Date();
    await user.save();

    // Log to audit
    await AuditLog.create({
      user_id: user.id,
      action: 'user_login',
      ip: req.ip
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Get profile based on role
    let profile = null;
    if (user.role === 'farmer') {
      profile = await FarmerProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'buyer') {
      profile = await BuyerProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'supplier') {
      profile = await SupplierProfile.findOne({ where: { user_id: user.id } });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          language: user.language,
          lat: user.lat,
          lng: user.lng
        },
        profile,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    let profile = null;
    if (user.role === 'farmer') {
      profile = await FarmerProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'buyer') {
      profile = await BuyerProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'supplier') {
      profile = await SupplierProfile.findOne({ where: { user_id: user.id } });
    }

    res.json({
      success: true,
      data: { user, profile }
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const { verifyRefreshToken } = require('../config/auth');
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Log to audit
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: 'user_logout',
        ip: req.ip
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};