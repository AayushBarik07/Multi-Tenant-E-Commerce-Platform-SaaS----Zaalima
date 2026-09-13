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
  const { userId } = req.auth; // clerk_user_id

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

module.exports = {
  getStores,
  getStoreById,
  createStore
};
