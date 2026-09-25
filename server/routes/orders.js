const express = require('express');
const router = express.Router();
const { getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

// Middleware to verify user is authenticated and is a shopper
const requireShopper = requireRole([ROLES.CUSTOMER, ROLES.VENDOR]);

router.get('/my-orders', requireShopper, getMyOrders);
router.put('/:id/status', requireShopper, updateOrderStatus);

module.exports = router;
