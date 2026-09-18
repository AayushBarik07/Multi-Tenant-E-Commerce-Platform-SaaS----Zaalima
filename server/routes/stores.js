const express = require('express');
const router = express.Router();
const { requireVendor } = require('../middleware/roleMiddleware');
const { 
  getStores, 
  getStoreById, 
  getMyStore, 
  getVendorStats,
  getVendorOrders, 
  createStore, 
  updateStore, 
  deleteStore 
} = require('../controllers/storeController');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreById);

// Protected Vendor routes
router.get('/my/store', requireVendor, getMyStore);
router.get('/my/stats', requireVendor, getVendorStats);
router.get('/my/orders', requireVendor, getVendorOrders);
router.post('/', requireVendor, createStore);
router.patch('/:id', requireVendor, updateStore);
router.delete('/:id', requireVendor, deleteStore);

module.exports = router;
