const fs = require('fs');
let content = fs.readFileSync('controllers/productController.js', 'utf8');

content = content.replace(/const addVariant = async \[\s\S]*deleteVariant\s*};/, `
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
`);

// Also fix getProductById to just order by created_at since 'value' no longer exists
content = content.replace("ORDER BY name, value", "ORDER BY created_at ASC");

fs.writeFileSync('controllers/productController.js', content);
