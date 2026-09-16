const db = require('../utils/db');

// @desc    Get all active stores (Public)
// @route   GET /api/stores
const getStores = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, slug, description, logo_url, created_at FROM stores WHERE status = $1',
      ['ACTIVE']
    );
    res.json({ success: true, count: result.rowCount, stores: result.rows });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Server error fetching stores' });
  }
};

// @desc    Get a single store by ID (Public)
// @route   GET /api/stores/:id
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, name, slug, description, logo_url, created_at FROM stores WHERE id = $1 AND status = $2',
      [id, 'ACTIVE']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ success: true, store: result.rows[0] });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Server error fetching store' });
  }
};

// @desc    Create a new store (Vendor only)
// @route   POST /api/stores
const createStore = async (req, res) => {
  const { name, description, logo_url } = req.body;
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req); // clerk_user_id

  if (!name) {
    return res.status(400).json({ error: 'Store name is required' });
  }

  try {
    // 1. Get the internal user ID from the database using the Clerk ID
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User record not found in database. Please sync auth.' });
    }
    
    const ownerUserId = userResult.rows[0].id;

    // 2. Generate a simple slug from the name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    // 3. Insert the new store
    const newStoreResult = await db.query(
      'INSERT INTO stores (owner_user_id, name, slug, description, logo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ownerUserId, name, slug, description || '', logo_url || '']
    );

    res.status(201).json({ success: true, store: newStoreResult.rows[0] });
  } catch (error) {
    console.error('Error creating store:', error);
    if (error.code === '23505') { // unique violation in PostgreSQL
      return res.status(400).json({ error: 'A store with a similar name/slug already exists' });
    }
    res.status(500).json({ error: 'Server error creating store' });
  }
};

// @desc    Get current vendor's store
// @route   GET /api/stores/my-store
const getMyStore = async (req, res) => {
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ownerUserId = userResult.rows[0].id;

    const result = await db.query('SELECT * FROM stores WHERE owner_user_id = $1', [ownerUserId]);
    
    if (result.rows.length === 0) {
      return res.json({ success: true, store: null });
    }

    res.json({ success: true, store: result.rows[0] });
  } catch (error) {
    console.error('Error fetching vendor store:', error);
    res.status(500).json({ error: 'Server error fetching store' });
  }
};

// @desc    Get current vendor's dashboard stats
// @route   GET /api/stores/my/stats
const getVendorStats = async (req, res) => {
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ownerUserId = userResult.rows[0].id;

    const storeResult = await db.query('SELECT id FROM stores WHERE owner_user_id = $1', [ownerUserId]);
    
    if (storeResult.rows.length === 0) {
      return res.json({ success: true, stats: { products: 0, orders: 0, revenue: 0 } });
    }
    const storeId = storeResult.rows[0].id;

    // Get product count
    const productsResult = await db.query('SELECT COUNT(*) FROM products WHERE store_id = $1', [storeId]);
    const activeProducts = parseInt(productsResult.rows[0].count, 10);

    // Orders & Revenue will be added in Week 3, returning 0 for now
    res.json({ 
      success: true, 
      stats: { 
        products: activeProducts, 
        orders: 0, 
        revenue: 0 
      } 
    });
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

// @desc    Update a store (Vendor only, must own the store)
// @route   PATCH /api/stores/:id
const updateStore = async (req, res) => {
  const { id } = req.params;
  const { name, description, logo_url, status } = req.body;
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  try {
    // 1. Verify ownership
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ownerUserId = userResult.rows[0].id;

    const storeResult = await db.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (storeResult.rows[0].owner_user_id !== ownerUserId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this store' });
    }

    // 2. Update store
    const currentStore = storeResult.rows[0];
    const updatedName = name || currentStore.name;
    const updatedDescription = description !== undefined ? description : currentStore.description;
    const updatedLogoUrl = logo_url !== undefined ? logo_url : currentStore.logo_url;
    const updatedStatus = status || currentStore.status;
    
    // We optionally update the slug if the name changes, but usually slugs should be immutable
    // For simplicity, we'll keep the old slug.
    
    const updateResult = await db.query(
      'UPDATE stores SET name = $1, description = $2, logo_url = $3, status = $4 WHERE id = $5 RETURNING *',
      [updatedName, updatedDescription, updatedLogoUrl, updatedStatus, id]
    );

    res.json({ success: true, store: updateResult.rows[0] });
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Server error updating store' });
  }
};

// @desc    Delete a store (Vendor only, must own the store)
// @route   DELETE /api/stores/:id
const deleteStore = async (req, res) => {
  const { id } = req.params;
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const ownerUserId = userResult.rows[0].id;

    const storeResult = await db.query('SELECT owner_user_id FROM stores WHERE id = $1', [id]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (storeResult.rows[0].owner_user_id !== ownerUserId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this store' });
    }

    await db.query('DELETE FROM stores WHERE id = $1', [id]);

    res.json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Server error deleting store' });
  }
};

module.exports = {
  getStores,
  getStoreById,
  getMyStore,
  getVendorStats,
  createStore,
  updateStore,
  deleteStore
};
