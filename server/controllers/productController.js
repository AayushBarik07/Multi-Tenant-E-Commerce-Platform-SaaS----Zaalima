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

// @desc    Get all active products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { store_id } = req.query;
    let query = 'SELECT * FROM products WHERE status = $1';
    let values = ['ACTIVE'];

    if (store_id) {
      query += ' AND store_id = $2';
      values.push(store_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, values);
    res.json({ success: true, count: result.rowCount, products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { store_id, name, description, price, stock, image_url } = req.body || {};
  const { userId } = getAuth(req);

  if (!store_id || !name || price === undefined) {
    return res.status(400).json({ error: 'Store ID, Name, and Price are required' });
  }

  try {
    const isOwner = await checkStoreOwnership(userId, store_id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: You do not own this store' });
    }

    const result = await db.query(
      'INSERT INTO products (store_id, name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [store_id, name, description || '', price, stock || 0, image_url || '']
    );

    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error creating product' });
  }
};

// @desc    Update a product
// @route   PATCH /api/products/:id
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, status } = req.body || {};
  const { userId } = getAuth(req);

  try {
    // Check product exists and get its store_id
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const storeId = productResult.rows[0].store_id;

    // Check ownership
    const isOwner = await checkStoreOwnership(userId, storeId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: You do not own the store for this product' });
    }

    const current = productResult.rows[0];
    
    const result = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [
        name || current.name,
        description !== undefined ? description : current.description,
        price !== undefined ? price : current.price,
        stock !== undefined ? stock : current.stock,
        image_url !== undefined ? image_url : current.image_url,
        status || current.status,
        id
      ]
    );

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { userId } = getAuth(req);

  try {
    const productResult = await db.query('SELECT store_id FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const storeId = productResult.rows[0].store_id;

    const isOwner = await checkStoreOwnership(userId, storeId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: You do not own the store for this product' });
    }

    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
