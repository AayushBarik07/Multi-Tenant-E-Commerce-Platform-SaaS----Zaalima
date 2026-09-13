const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const { requireVendor } = require('../middleware/roleMiddleware');
const { getStores, getStoreById, createStore } = require('../controllers/storeController');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreById);

// Protected Vendor routes
router.post('/', requireAuth(), requireVendor, createStore);

module.exports = router;
