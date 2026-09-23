const fs = require('fs');
let content = fs.readFileSync('controllers/adminController.js', 'utf8');

const newMethods = `

const getStores = async (req, res) => {
  try {
    const result = await db.query(\`
      SELECT s.id, s.name, s.created_at, u.email as owner_email,
      (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as product_count,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders o WHERE o.store_id = s.id AND o.payment_status = 'SUCCESS') as total_revenue
      FROM stores s
      JOIN users u ON s.owner_user_id = u.id
      ORDER BY s.created_at DESC
    \`);
    res.json({ success: true, stores: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await db.query(\`
      SELECT p.id, p.name, p.price, p.stock, p.status, p.created_at, s.name as store_name
      FROM products p
      JOIN stores s ON p.store_id = s.id
      ORDER BY p.created_at DESC
    \`);
    res.json({ success: true, products: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await db.query(\`
      SELECT o.id, o.total_amount, o.created_at, o.payment_status, u.email as customer_email, s.name as store_name
      FROM orders o
      JOIN users u ON o.customer_user_id = u.id
      JOIN stores s ON o.store_id = s.id
      ORDER BY o.created_at DESC
    \`);
    res.json({ success: true, orders: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getPlatformStats,
  getStores,
  getProducts,
  getOrders
};
`;

content = content.replace("module.exports = {\n  getPlatformStats\n};", newMethods);
fs.writeFileSync('controllers/adminController.js', content);
