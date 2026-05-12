/**
 * Gemini AI Routes
 * Protected routes for AI-powered agricultural advice
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const {
  getAgriculturalAdvice
} = require('../controllers/geminiController');

// All routes require authentication
router.use(protect);

// Main advice endpoint - accessible to farmers and cooperatives
router.post('/advice', 
  restrictTo('farmer', 'cooperative', 'admin'),
  getAgriculturalAdvice
);

module.exports = router;