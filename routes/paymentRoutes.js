const express = require('express');
const router = express.Router();
const { authenticate, restrictTo } = require('../middleware/auth');
const { approvePayment, getPayments } = require('../controllers/paymentController');

router.post('/payments/approve', authenticate, restrictTo('admin','supplier','fra'), approvePayment);
router.get('/payments', authenticate, getPayments);
module.exports = router;
