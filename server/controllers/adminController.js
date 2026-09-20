const db = require('../utils/db');

// @desc    Get overall platform metrics
// @route   GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    // Total Users
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total_users, 10);

    // Total Stores
    const storesResult = await db.query('SELECT COUNT(*) as total_stores FROM stores');
    const totalStores = parseInt(storesResult.rows[0].total_stores, 10);

    // Total Revenue (SUCCESS orders)
    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) as platform_revenue FROM orders WHERE payment_status = 'SUCCESS'");
    const platformRevenue = parseFloat(revenueResult.rows[0].platform_revenue);

    // Total Orders (SUCCESS orders)
    const ordersResult = await db.query("SELECT COUNT(*) as total_orders FROM orders WHERE payment_status = 'SUCCESS'");
    const totalOrders = parseInt(ordersResult.rows[0].total_orders, 10);
    
    // Revenue over time (Last 7 days) for Charting
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

    // Recent 5 Stores
    const recentStoresResult = await db.query('SELECT id, name, created_at FROM stores ORDER BY created_at DESC LIMIT 5');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        platformRevenue,
        totalOrders,
        recentStores: recentStoresResult.rows,
        revenueChartData: chartDataResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Server error fetching admin stats' });
  }
};

module.exports = {
  getPlatformStats
};
