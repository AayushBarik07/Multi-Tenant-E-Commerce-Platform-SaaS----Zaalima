const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { getBrands, createBrand, deleteBrand } = require('../controllers/brandController');

// Public route
router.get('/', getBrands);

// Protected routes (Vendors only)
router.post('/', requireVendor, createBrand);
router.delete('/:id', requireVendor, deleteBrand);

module.exports = router;
