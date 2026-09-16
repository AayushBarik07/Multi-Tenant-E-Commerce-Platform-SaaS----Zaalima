const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addVariant,
  deleteVariant
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Variant routes (Must be before /:id routes to prevent collision)
router.post('/:id/variants', requireVendor, addVariant);
router.delete('/variants/:variantId', requireVendor, deleteVariant);

// Protected Vendor routes
router.post('/', requireVendor, createProduct);
router.patch('/:id', requireVendor, updateProduct);
router.delete('/:id', requireVendor, deleteProduct);

module.exports = router;
