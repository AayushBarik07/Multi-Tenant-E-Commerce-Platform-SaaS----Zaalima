const express = require('express');
const router = express.Router();
const { requireVendor, requireSuperAdmin } = require('../middleware/roleMiddleware');
const { getVendorWallet, requestPayout, getAdminPayouts, updatePayoutStatus } = require('../controllers/payoutController');

// Vendor routes
router.get('/wallet', requireVendor, getVendorWallet);
router.post('/request', requireVendor, requestPayout);

// Admin routes
router.get('/admin', requireSuperAdmin, getAdminPayouts);
router.patch('/admin/:id', requireSuperAdmin, updatePayoutStatus);

module.exports = router;
