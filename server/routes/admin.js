const express = require('express');
const router = express.Router();
const { requireSuperAdmin } = require('../middleware/roleMiddleware');
const { getPlatformStats, getStores, getProducts, getOrders } = require('../controllers/adminController');

// All admin routes must be protected and restricted to SUPER_ADMIN role
router.use(requireSuperAdmin);

router.get('/stats', getPlatformStats);
router.get('/stores', getStores);
router.get('/products', getProducts);
router.get('/orders', getOrders);

module.exports = router;
