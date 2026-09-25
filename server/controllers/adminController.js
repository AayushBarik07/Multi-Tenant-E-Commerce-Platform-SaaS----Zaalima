const db = require('../utils/db');

const getPlatformStats = async (req, res) => {
  try {
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total_users, 10);

    const storesResult = await db.query('SELECT COUNT(*) as total_stores FROM stores');
    const totalStores = parseInt(storesResult.rows[0].total_stores, 10);

    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) as platform_revenue FROM orders WHERE payment_status = 'SUCCESS'");
    const platformRevenue = parseFloat(revenueResult.rows[0].platform_revenue);

    const ordersResult = await db.query("SELECT COUNT(*) as total_orders FROM orders WHERE payment_status = 'SUCCESS'");
    const totalOrders = parseInt(ordersResult.rows[0].total_orders, 10);
    
    const chartDataResult = await db.query(`
      SELECT 
        TO_CHAR(DATE(created_at), 'Mon DD') as date,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE payment_status = 'SUCCESS'
        AND created_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    const recentStoresResult = await db.query('SELECT id, name, created_at FROM stores ORDER BY created_at DESC LIMIT 5');
    
    const recentOrdersResult = await db.query(`SELECT o.id, o.total_amount, o.created_at, o.payment_status, o.payment_reference, u.email as customer_email, s.name as store_name FROM orders o JOIN users u ON o.customer_user_id = u.id JOIN stores s ON o.store_id = s.id ORDER BY o.created_at DESC LIMIT 10`);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        platformRevenue,
        totalOrders,
        recentStores: recentStoresResult.rows,
        revenueChartData: chartDataResult.rows,
        recentOrders: recentOrdersResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.id, s.name, s.created_at, u.email as owner_email,
      (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as product_count,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders o WHERE o.store_id = s.id AND o.payment_status = 'SUCCESS') as total_revenue
      FROM stores s
      JOIN users u ON s.owner_user_id = u.id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, stores: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.name, p.price, p.stock, p.status, p.created_at, p.image_url, s.name as store_name
      FROM products p
      JOIN stores s ON p.store_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, products: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.id, o.total_amount, o.created_at, o.payment_status, o.payment_reference, u.email as customer_email, s.name as store_name
      FROM orders o
      JOIN users u ON o.customer_user_id = u.id
      JOIN stores s ON o.store_id = s.id
      ORDER BY o.created_at DESC
    `);
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
