/**
 * Buyer Routes
 * Protected routes for buyer operations
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const buyerController = require('../controllers/buyerController');

router.use(protect);
router.use(restrictTo('buyer', 'admin'));

router.get('/dashboard', buyerController.getDashboard);
router.get('/crops', buyerController.browseCrops);
router.post('/orders', buyerController.placeOrder);
router.get('/orders', buyerController.getOrders);
router.get('/orders/:id', buyerController.getOrderById);

module.exports = router;