const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createProduct, getFarmerProducts } = require('../controllers/productController');

router.post('/', protect, createProduct);
router.get('/my-products', protect, getFarmerProducts);

module.exports = router;
