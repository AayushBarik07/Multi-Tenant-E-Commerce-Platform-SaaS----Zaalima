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
    const { store_id, brand_id } = req.query;
    let query = 'SELECT * FROM products WHERE status = $1';
    let values = ['ACTIVE'];
    let paramCount = 1;

    if (store_id) {
      paramCount++;
      query += ` AND store_id = $${paramCount}`;
      values.push(store_id);
    }
    
    if (brand_id) {
      paramCount++;
      query += ` AND brand_id = $${paramCount}`;
      values.push(brand_id);
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

    const product = result.rows[0];
    
    // Fetch variants
    const variantsResult = await db.query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC', [id]);
    product.variants = variantsResult.rows;

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { store_id, brand_id, name, description, price, stock, image_url, category } = req.body || {};
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
      'INSERT INTO products (store_id, brand_id, name, description, price, stock, image_url, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [store_id, brand_id || null, name, description || '', price, stock || 0, image_url || '', category || null]
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
  const { brand_id, name, description, price, stock, image_url, status, category } = req.body || {};
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
      'UPDATE products SET brand_id = $1, name = $2, description = $3, price = $4, stock = $5, image_url = $6, status = $7, category = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [
        brand_id !== undefined ? brand_id : current.brand_id,
        name || current.name,
        description !== undefined ? description : current.description,
        price !== undefined ? price : current.price,
        stock !== undefined ? stock : current.stock,
        image_url !== undefined ? image_url : current.image_url,
        status || current.status,
        category !== undefined ? category : current.category,
        id
      ]
    );

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error updating product' });
  }
};

// @desc    Delete a product (Soft Delete to preserve order history)
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

    // Instead of hard deleting (which breaks foreign keys if the product was ordered), we Soft Delete it
    await db.query('UPDATE products SET status = $1 WHERE id = $2', ['ARCHIVED', id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
};

// @desc    Add a variant to a product
// @route   POST /api/products/:id/variants
const addVariant = async (req, res) => {
  const { id } = req.params; // Product ID
  const { name, price, stock } = req.body;
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  if (!name) {
    return res.status(400).json({ error: 'Variant name is required' });
  }

  try {
    const productResult = await db.query('SELECT store_id FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const storeId = productResult.rows[0].store_id;
    const isOwner = await checkStoreOwnership(userId, storeId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await db.query(
      'INSERT INTO product_variants (product_id, name, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, price !== undefined ? price : null, stock || 0]
    );

    res.status(201).json({ success: true, variant: result.rows[0] });
  } catch (error) {
    console.error('Error adding variant:', error);
    res.status(500).json({ error: 'Server error adding variant' });
  }
};

// @desc    Delete a variant
// @route   DELETE /api/products/variants/:variantId
const deleteVariant = async (req, res) => {
  const { variantId } = req.params;
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);

  try {
    const variantResult = await db.query('SELECT product_id FROM product_variants WHERE id = $1', [variantId]);
    if (variantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    const productId = variantResult.rows[0].product_id;
    const productResult = await db.query('SELECT store_id FROM products WHERE id = $1', [productId]);
    
    const storeId = productResult.rows[0].store_id;
    const isOwner = await checkStoreOwnership(userId, storeId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await db.query('DELETE FROM product_variants WHERE id = $1', [variantId]);
    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ error: 'Server error deleting variant' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  deleteVariant
};
