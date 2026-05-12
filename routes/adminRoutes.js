/**
 * Admin Routes
 * Protected routes for system administration
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id/approve', adminController.approveUser);
router.put('/users/:id/deactivate', adminController.deactivateUser);
router.get('/analytics', adminController.getAnalytics);
router.get('/logs', adminController.getSystemLogs);
router.get('/health', adminController.getSystemHealth);

module.exports = router;