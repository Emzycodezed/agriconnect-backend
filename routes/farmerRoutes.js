/**
 * Farmer Routes
 * Protected routes for farmer operations
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const farmerController = require('../controllers/farmerController');

router.use(protect);
router.use(restrictTo('farmer', 'admin'));

router.get('/dashboard', farmerController.getDashboard);
router.get('/crops', farmerController.getCrops);
router.post('/crops', farmerController.registerCrop);
router.get('/crops/:id', farmerController.getCropById);
router.put('/crops/:id', farmerController.updateCrop);
router.get('/orders', farmerController.getOrders);
router.get('/profile', farmerController.getProfile);
router.put('/profile', farmerController.updateProfile);

module.exports = router;