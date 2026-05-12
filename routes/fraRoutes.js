/**
 * FRA (Food Reserve Agency) Routes
 * Protected routes for government operations
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const fraController = require('../controllers/fraController');

router.use(protect);
router.use(restrictTo('fra', 'admin'));

router.get('/dashboard', fraController.getDashboard);
router.post('/pricing', fraController.setMaizePrice);
router.get('/purchases', fraController.getPurchases);
router.post('/purchases', fraController.createPurchase);
router.get('/farmers', fraController.getRegisteredFarmers);
router.get('/reports/national-stock', fraController.getNationalStockReport);

module.exports = router;