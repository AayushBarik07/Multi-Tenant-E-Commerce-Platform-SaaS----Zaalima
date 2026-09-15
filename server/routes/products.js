const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Vendor routes (roleMiddleware automatically verifies JWT and role)
router.post('/', requireVendor, createProduct);
router.patch('/:id', requireVendor, updateProduct);
router.delete('/:id', requireVendor, deleteProduct);

module.exports = router;
