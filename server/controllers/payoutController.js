const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// @desc    Request a payout
// @route   POST /api/payouts/request
const requestPayout = async (req, res) => {
  const { userId } = getAuth(req);
  const { amount } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Minimum payout request is ₹100' });
  }

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    // Optional: check if vendor has enough balance here. Assuming we just log the request.
    
    const result = await db.query(
      'INSERT INTO payouts (vendor_id, amount) VALUES ($1, $2) RETURNING *',
      [dbUserId, amount]
    );

    res.json({ success: true, payout: result.rows[0] });
  } catch (error) {
    console.error('Error requesting payout:', error);
    res.status(500).json({ error: 'Server error requesting payout' });
  }
};

// @desc    Get payouts (Vendor gets own, Admin gets all)
// @route   GET /api/payouts
const getPayouts = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id, role FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const user = userResult.rows[0];

    let query = '';
    let params = [];

    if (user.role === 'SUPER_ADMIN') {
      // Admin sees all
      query = `SELECT p.*, u.email as vendor_email, s.name as store_name
               FROM payouts p
               JOIN users u ON p.vendor_id = u.id
               LEFT JOIN stores s ON s.owner_user_id = u.id
               ORDER BY p.requested_at DESC`;
    } else {
      // Vendor sees their own
      query = 'SELECT * FROM payouts WHERE vendor_id = $1 ORDER BY requested_at DESC';
      params = [user.id];
    }

    const result = await db.query(query, params);
    res.json({ success: true, payouts: result.rows });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    require('fs').appendFileSync('payout_error.log', new Date().toISOString() + ' ' + error.stack + '\n');
    res.status(500).json({ error: 'Server error fetching payouts' });
  }
};

// @desc    Update payout status (Admin only)
// @route   PUT /api/payouts/:id/status
const updatePayoutStatus = async (req, res) => {
  const payoutId = req.params.id;
  const { status } = req.body;

  if (!['COMPLETED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await db.query(
      'UPDATE payouts SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, payoutId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Payout not found' });
    
    res.json({ success: true, payout: result.rows[0] });
  } catch (error) {
    console.error('Error updating payout:', error);
    res.status(500).json({ error: 'Server error updating payout' });
  }
};



// @desc    Get wallet stats for vendor
// @route   GET /api/payouts/wallet
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
      
      const salesQuery = `
        SELECT COALESCE(SUM(oi.subtotal), 0) as total_sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE p.store_id = $1 AND o.payment_status = 'SUCCESS'
      `;
      const salesResult = await db.query(salesQuery, [storeId]);
      totalSales = parseFloat(salesResult.rows[0].total_sales);
    }

    const commissionRate = 0.10;
    const lifetimeEarnings = totalSales * (1 - commissionRate);

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
        availableBalance
      }
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getWallet,
  requestPayout,
  getPayouts,
  updatePayoutStatus
};
