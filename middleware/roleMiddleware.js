/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access based on user roles
 */

/**
 * Allowed roles: 'farmer', 'buyer', 'supplier', 'fra', 'cooperative', 'admin'
 * @param  {...String} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Please login'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Check if user owns resource or is admin
 */
const isOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied - Not resource owner'
    });
  };
};

module.exports = { restrictTo, isOwnerOrAdmin };