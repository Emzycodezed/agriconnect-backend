/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
const { verifyAccessToken } = require('../config/auth');
const { User } = require('../models');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    try {
      // Verify token
      const decoded = verifyAccessToken(token);
      
      // Get user from database (exclude password)
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth - doesn't fail if no token, but attaches user if valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password_hash'] }
        });
        if (user && user.is_active) {
          req.user = user;
        }
      } catch (err) {
        // Silently fail for optional auth
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, optionalAuth };