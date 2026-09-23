const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// Helper to check if vendor owns the store
const checkStoreOwnership = async (userId, storeId) => {
  const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
  if (userResult.rows.length === 0) return false;
  
  const ownerId = userResult.rows[0].id;
  const storeResult = await db.query('SELECT owner_user_id FROM stores WHERE id = $1', [storeId]);
  
  if (storeResult.rows.length === 0) return false;
  return storeResult.rows[0].owner_user_id === ownerId;
};

// @desc    Get all brands (globally or for a specific store)
// @route   GET /api/brands?store_id=...
const getBrands = async (req, res) => {
  try {
    const { store_id } = req.query;
    
    let query = `
      SELECT b.*, s.name as store_name 
      FROM store_brands b 
      JOIN stores s ON b.store_id = s.id 
    `;
    let values = [];

    if (store_id) {
      query += ` WHERE b.store_id = $1 `;
      values.push(store_id);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await db.query(query, values);
    res.json({ success: true, count: result.rowCount, brands: result.rows });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Server error fetching brands' });
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
const createBrand = async (req, res) => {
  const { store_id, name, description, logo_url } = req.body;
  const { userId } = getAuth(req);

  if (!store_id || !name) {
    return res.status(400).json({ error: 'Store ID and Brand name are required' });
  }

  try {
    const isOwner = await checkStoreOwnership(userId, store_id);
    if (!isOwner) return res.status(403).json({ error: 'Forbidden' });

    const result = await db.query(
      'INSERT INTO store_brands (store_id, name, description, logo_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [store_id, name, description, logo_url]
    );

    res.status(201).json({ success: true, brand: result.rows[0] });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ error: 'Server error creating brand' });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
const deleteBrand = async (req, res) => {
  const { id } = req.params;
  const { userId } = getAuth(req);

  try {
    const brandResult = await db.query('SELECT store_id FROM store_brands WHERE id = $1', [id]);
    if (brandResult.rows.length === 0) return res.status(404).json({ error: 'Brand not found' });
    
    const storeId = brandResult.rows[0].store_id;
    const isOwner = await checkStoreOwnership(userId, storeId);
    if (!isOwner) return res.status(403).json({ error: 'Forbidden' });

    await db.query('DELETE FROM store_brands WHERE id = $1', [id]);
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Server error deleting brand' });
  }
};

module.exports = {
  getBrands,
  createBrand,
  deleteBrand
};
