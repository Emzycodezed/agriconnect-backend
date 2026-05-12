/**
 * Authentication Routes
 * Handles user registration, login, and token refresh
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Validation middleware
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['farmer', 'buyer', 'supplier', 'extension', 'admin']).withMessage('Invalid role'),
  body('lat').optional().isDecimal().withMessage('Valid latitude required'),
  body('lng').optional().isDecimal().withMessage('Valid longitude required'),
  body('language').optional().isIn(['nyanja', 'bemba', 'english']).withMessage('Invalid language')
];

const loginValidation = [
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('password').notEmpty().withMessage('Password required')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;