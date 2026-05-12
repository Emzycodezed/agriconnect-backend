const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createFarmerOrder, getFarmerOrders, cancelOrder } = require('../controllers/farmerOrderController');

router.post('/orders', authenticate, createFarmerOrder);
router.get('/orders', authenticate, getFarmerOrders);
router.put('/orders/:id/cancel', authenticate, cancelOrder);
module.exports = router;
