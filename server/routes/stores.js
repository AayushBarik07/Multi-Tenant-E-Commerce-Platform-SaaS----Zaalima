const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { getStores, getStoreById, createStore, updateStore, deleteStore } = require('../controllers/storeController');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreById);

// Protected Vendor routes
// roleMiddleware already checks getAuth(req).userId and returns JSON 401
router.post('/', requireVendor, createStore);
router.patch('/:id', requireVendor, updateStore);
router.delete('/:id', requireVendor, deleteStore);

module.exports = router;
