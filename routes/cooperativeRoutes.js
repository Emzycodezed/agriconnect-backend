/**
 * Cooperative Routes
 * Protected routes for cooperative management
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const cooperativeController = require('../controllers/cooperativeController');

router.use(protect);
router.use(restrictTo('cooperative', 'admin'));

router.get('/dashboard', cooperativeController.getDashboard);
router.get('/members', cooperativeController.getMembers);
router.post('/members', cooperativeController.addMember);
router.get('/loans', cooperativeController.getLoans);
router.post('/loans', cooperativeController.createLoan);
router.get('/bulk-sales', cooperativeController.getBulkSales);
router.post('/bulk-sales', cooperativeController.createBulkSale);

module.exports = router;