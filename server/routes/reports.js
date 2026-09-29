const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');
const { getVendorReport, getAdminReport } = require('../controllers/reportController');

// Vendor route
router.get('/vendor', requireRole([ROLES.VENDOR]), getVendorReport);

// Admin route
router.get('/admin', requireRole([ROLES.SUPER_ADMIN]), getAdminReport);

module.exports = router;
