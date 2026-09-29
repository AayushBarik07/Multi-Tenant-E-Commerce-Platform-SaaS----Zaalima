const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');
const { requestPayout, getPayouts, updatePayoutStatus, getWallet } = require('../controllers/payoutController');

// Vendor routes
router.get('/wallet', requireRole([ROLES.VENDOR]), getWallet);
router.post('/request', requireRole([ROLES.VENDOR]), requestPayout);

// Vendor & Admin route
router.get('/', requireRole([ROLES.VENDOR, ROLES.SUPER_ADMIN]), getPayouts);

// Admin route
router.put('/:id/status', requireRole([ROLES.SUPER_ADMIN]), updatePayoutStatus);

module.exports = router;
