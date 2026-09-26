const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    const result = await db.query(
      `SELECT w.id as wishlist_id, p.* 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [dbUserId]
    );

    res.json({ success: true, wishlist: result.rows });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Server error fetching wishlist' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
const addToWishlist = async (req, res) => {
  const { userId } = getAuth(req);
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    const result = await db.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
      [dbUserId, productId]
    );

    res.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Server error adding to wishlist' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  const { userId } = getAuth(req);
  const productId = req.params.productId;

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    await db.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [dbUserId, productId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Server error removing from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
