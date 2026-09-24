const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

// Middleware to verify user is authenticated and NOT a super admin
const requireShopper = requireRole([ROLES.CUSTOMER, ROLES.VENDOR]);

router.post('/create-intent', requireShopper, createPaymentIntent);
router.post('/confirm', requireShopper, confirmPayment);

module.exports = router;
