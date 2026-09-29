const fs = require('fs');

// Update payoutController.js
let controller = fs.readFileSync('server/controllers/payoutController.js', 'utf8');

if (!controller.includes('getWallet')) {
  const getWalletFunc = `

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
`;

  controller = controller.replace('module.exports = {', getWalletFunc + '\nmodule.exports = {');
  controller = controller.replace('module.exports = {', 'module.exports = {\n  getWallet,');
  fs.writeFileSync('server/controllers/payoutController.js', controller);
  console.log('payoutController.js updated with getWallet');
}

// Update payouts.js route
let routes = fs.readFileSync('server/routes/payouts.js', 'utf8');
if (!routes.includes('getWallet')) {
  routes = routes.replace('const { requestPayout, getPayouts, updatePayoutStatus } = require(\'../controllers/payoutController\');', 'const { requestPayout, getPayouts, updatePayoutStatus, getWallet } = require(\'../controllers/payoutController\');');
  routes = routes.replace('router.post(\'/request\',', 'router.get(\'/wallet\', requireRole([ROLES.VENDOR]), getWallet);\nrouter.post(\'/request\',');
  fs.writeFileSync('server/routes/payouts.js', routes);
  console.log('payouts.js updated with wallet route');
}
