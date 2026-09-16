const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { getStores, getStoreById, getMyStore, getVendorStats, createStore, updateStore, deleteStore } = require('../controllers/storeController');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreById);

// Protected Vendor routes
// roleMiddleware already checks getAuth(req).userId and returns JSON 401
router.get('/my/store', requireVendor, getMyStore);
router.get('/my/stats', requireVendor, getVendorStats);
router.post('/', requireVendor, createStore);
router.patch('/:id', requireVendor, updateStore);
router.delete('/:id', requireVendor, deleteStore);

module.exports = router;
