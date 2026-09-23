const db = require('../utils/db');
const { getAuth } = require('@clerk/express');

// Platform commission rate (e.g., 5%)
const COMMISSION_RATE = 0.05;

// Helper to get store ID from auth
const getVendorStoreId = async (req) => {
  const { userId } = getAuth(req);
  if (!userId) return null;
  const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
  if (userResult.rows.length === 0) return null;
  const ownerUserId = userResult.rows[0].id;
  const storeResult = await db.query('SELECT id FROM stores WHERE owner_user_id = $1', [ownerUserId]);
  if (storeResult.rows.length === 0) return null;
  return storeResult.rows[0].id;
};

// @desc    Get vendor wallet details
// @route   GET /api/payouts/wallet
const getVendorWallet = async (req, res) => {
  try {
    const storeId = await getVendorStoreId(req);
    if (!storeId) return res.status(404).json({ error: 'Store not found' });

    // 1. Calculate Lifetime Sales
    const salesResult = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM orders WHERE store_id = $1 AND payment_status = 'SUCCESS'",
      [storeId]
    );
    const totalSales = parseFloat(salesResult.rows[0].total_sales);
    
    // Vendor keeps 95%
    const lifetimeEarnings = totalSales * (1 - COMMISSION_RATE);

    // 2. Get Payout History
    const historyResult = await db.query(
      "SELECT id, amount, status, requested_at, paid_at FROM payout_requests WHERE store_id = $1 ORDER BY requested_at DESC",
      [storeId]
    );
    const history = historyResult.rows;

    // 3. Calculate Withdrawn and Pending
    let totalWithdrawn = 0;
    let totalPending = 0;

    history.forEach(p => {
      if (p.status === 'PAID') totalWithdrawn += parseFloat(p.amount);
      if (p.status === 'PENDING') totalPending += parseFloat(p.amount);
    });

    const availableBalance = lifetimeEarnings - totalWithdrawn - totalPending;

    res.json({
      success: true,
      wallet: {
        totalSales,
        commissionRate: COMMISSION_RATE,
        lifetimeEarnings,
        totalWithdrawn,
        totalPending,
        availableBalance,
        history
      }
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: 'Server error fetching wallet' });
  }
};

// @desc    Request a new payout
// @route   POST /api/payouts/request
const requestPayout = async (req, res) => {
  try {
    const storeId = await getVendorStoreId(req);
    if (!storeId) return res.status(404).json({ error: 'Store not found' });

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payout amount' });
    }

    // Verify balance
    const salesResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM orders WHERE store_id = $1 AND payment_status = 'SUCCESS'", [storeId]);
    const lifetimeEarnings = parseFloat(salesResult.rows[0].total_sales) * (1 - COMMISSION_RATE);
    
    const payoutSumResult = await db.query("SELECT COALESCE(SUM(amount), 0) as total_deducted FROM payout_requests WHERE store_id = $1 AND status IN ('PAID', 'PENDING')", [storeId]);
    const totalDeducted = parseFloat(payoutSumResult.rows[0].total_deducted);

    const availableBalance = lifetimeEarnings - totalDeducted;

    if (amount > availableBalance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Create request
    const newRequest = await db.query(
      "INSERT INTO payout_requests (store_id, amount, status) VALUES ($1, $2, 'PENDING') RETURNING *",
      [storeId, amount]
    );

    res.status(201).json({ success: true, request: newRequest.rows[0] });
  } catch (error) {
    console.error('Error requesting payout:', error);
    res.status(500).json({ error: 'Server error processing request' });
  }
};

// @desc    Get all payouts (Admin only)
// @route   GET /api/payouts/admin
const getAdminPayouts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, s.name as store_name, u.email as owner_email
      FROM payout_requests p
      JOIN stores s ON p.store_id = s.id
      JOIN users u ON s.owner_user_id = u.id
      ORDER BY p.requested_at DESC
    `);
    res.json({ success: true, payouts: result.rows });
  } catch (error) {
    console.error('Error fetching admin payouts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update payout status (Admin only)
// @route   PATCH /api/payouts/admin/:id
const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!['PAID', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const paid_at = status === 'PAID' ? new Date() : null;

    const result = await db.query(
      "UPDATE payout_requests SET status = $1, admin_notes = $2, paid_at = $3 WHERE id = $4 RETURNING *",
      [status, admin_notes || null, paid_at, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payout request not found' });
    }

    res.json({ success: true, request: result.rows[0] });
  } catch (error) {
    console.error('Error updating payout:', error);
    res.status(500).json({ error: 'Server error updating status' });
  }
};

module.exports = {
  getVendorWallet,
  requestPayout,
  getAdminPayouts,
  updatePayoutStatus
};
