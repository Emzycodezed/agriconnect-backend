/**
 * Dashboard Routes
 * Role-specific dashboard and profile endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// Get user dashboard based on role
router.get('/', dashboardController.getDashboard);

// Get market prices (public endpoint for logged-in users)
router.get('/market-prices', dashboardController.getMarketPrices);

// Profile management
router.get('/profile', dashboardController.getProfile);

router.put('/profile', [
  body('name').optional().isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('language').optional().isIn(['nyanja', 'bemba', 'english']).withMessage('Invalid language'),
  body('lat').optional().isDecimal().withMessage('Valid latitude required'),
  body('lng').optional().isDecimal().withMessage('Valid longitude required'),
], dashboardController.updateProfile);

// Products management
router.get('/products', dashboardController.getProducts);
router.post('/products', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price required'),
  body('price_per_unit').optional().isFloat({ min: 0 }).withMessage('Valid price_per_unit required'),
  body('quantity').optional().notEmpty().withMessage('Valid quantity required'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Valid stock_quantity required'),
], dashboardController.createProduct);
router.put('/products/:id', dashboardController.updateProduct);
router.delete('/products/:id', dashboardController.deleteProduct);

// AI Advisory
router.post('/ai-advisor', [
  body('query').notEmpty().withMessage('Query is required'),
  body('crop').optional().isString().withMessage('Crop must be a string'),
], dashboardController.getAIAdvice);

// Reports
router.get('/reports', dashboardController.getReports);
router.post('/reports', [
  body('title').optional().isString().withMessage('Title must be text'),
  body('description').optional().isString().withMessage('Description must be text'),
  body('report_text').optional().isString().withMessage('report_text must be text'),
  body('farmer_id').optional().isInt({ min: 1 }).withMessage('farmer_id must be a valid id'),
  body('extension_id').optional().isInt({ min: 1 }).withMessage('extension_id must be a valid id'),
], dashboardController.createReport);
router.get('/reports/:id', dashboardController.getReportDetail);

// Complaints
router.get('/complaints', dashboardController.getComplaints);
router.post('/complaints', [
  body('message').optional().isString().withMessage('message must be text'),
  body('description').optional().isString().withMessage('description must be text')
], dashboardController.createComplaint);
router.patch('/complaints/:id/resolve', dashboardController.resolveComplaint);

// Messaging
router.get('/contacts', dashboardController.getMessageContacts);
router.get('/messages', dashboardController.getMessages);
router.post('/messages', [
  body('recipient_id').isInt({ min: 1 }).withMessage('recipient_id must be a valid id'),
  body('content').notEmpty().withMessage('content is required'),
  body('channel').optional().isIn(['sms', 'voice', 'app']).withMessage('channel must be sms, voice, or app')
], dashboardController.sendMessage);
router.get('/messages/:id', dashboardController.getMessageDetail);

module.exports = router;
