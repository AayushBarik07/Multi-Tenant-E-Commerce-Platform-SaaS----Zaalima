const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { requireRole } = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

// Middleware to verify user is authenticated
const requireAuth = requireRole([ROLES.CUSTOMER, ROLES.VENDOR, ROLES.SUPER_ADMIN]);

router.get('/', requireAuth, getWishlist);
router.post('/', requireAuth, addToWishlist);
router.delete('/:productId', requireAuth, removeFromWishlist);

module.exports = router;
