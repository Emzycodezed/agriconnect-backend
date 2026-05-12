/**
 * Supplier Routes
 * Protected routes for supplier operations
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const supplierController = require('../controllers/supplierController');

router.use(protect);
router.use(restrictTo('supplier', 'admin'));

router.get('/dashboard', supplierController.getDashboard);
router.get('/products', supplierController.getProducts);
router.post('/products', supplierController.addProduct);
router.put('/products/:id', supplierController.updateProduct);
router.get('/orders', supplierController.getOrders);
router.put('/orders/:id/status', supplierController.updateOrderStatus);

module.exports = router;