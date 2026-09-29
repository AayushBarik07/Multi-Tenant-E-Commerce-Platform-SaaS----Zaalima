const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// Helper to get wallet stats
const getWallet = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    // Get vendor's store
    const storeResult = await db.query('SELECT id FROM stores WHERE owner_user_id = $1', [dbUserId]);
    
    let totalSales = 0;
    
    if (storeResult.rows.length > 0) {
      const storeId = storeResult.rows[0].id;
      
      // Calculate total sales from successful orders for this vendor's products
      const salesQuery = \`
        SELECT COALESCE(SUM(oi.subtotal), 0) as total_sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE p.store_id = $1 AND o.payment_status = 'SUCCESS'
      \`;
      const salesResult = await db.query(salesQuery, [storeId]);
      totalSales = parseFloat(salesResult.rows[0].total_sales);
    }

    // Fixed commission rate: 10%
    const commissionRate = 0.10;
    const lifetimeEarnings = totalSales * (1 - commissionRate);

    // Get payouts
    const payoutsQuery = 'SELECT COALESCE(SUM(amount), 0) as amount, status FROM payouts WHERE vendor_id = $1 GROUP BY status';
    const payoutsResult = await db.query(payoutsQuery, [dbUserId]);
    
    let totalPending = 0;
    let totalCompleted = 0;

    payoutsResult.rows.forEach(row => {
      if (row.status === 'PENDING') totalPending += parseFloat(row.amount);
      if (row.status === 'COMPLETED') totalCompleted += parseFloat(row.amount);
    });

    const availableBalance = lifetimeEarnings - totalPending - totalCompleted;

    res.json({
      success: true,
      wallet: {
        totalSales,
        commissionRate,
        lifetimeEarnings,
        totalPending,
        totalCompleted,
        availableBalance,
        history: [] // we fetch history separately now
      }
    });

  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Server error fetching wallet' });
  }
};

// ... existing code needs to be merged, let me write a script to just append getWallet and export it
