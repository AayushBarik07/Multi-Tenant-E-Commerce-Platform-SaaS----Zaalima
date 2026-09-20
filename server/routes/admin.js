const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { requireSuperAdmin } = require('../middleware/roleMiddleware');
const { getPlatformStats } = require('../controllers/adminController');

// All admin routes must be protected and restricted to SUPER_ADMIN role
router.use(requireAuth());
router.use(requireSuperAdmin);

router.get('/stats', getPlatformStats);

module.exports = router;
