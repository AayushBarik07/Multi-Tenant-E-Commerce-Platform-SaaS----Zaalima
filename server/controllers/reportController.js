const db = require('../utils/db');
const { getAuth } = require('@clerk/express');
const xlsx = require('xlsx');

// @desc    Download Vendor Analytics Report
// @route   GET /api/reports/vendor
const getVendorReport = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const dbUserId = userResult.rows[0].id;

    const storeResult = await db.query('SELECT id, name FROM stores WHERE owner_user_id = $1', [dbUserId]);
    if (storeResult.rows.length === 0) return res.status(404).json({ error: 'Store not found' });
    const storeId = storeResult.rows[0].id;
    const storeName = storeResult.rows[0].name;

    // 1. Order History
    const ordersQuery = `
      SELECT 
        o.id as "Order ID",
        TO_CHAR(o.created_at, 'YYYY-MM-DD HH24:MI:SS') as "Date",
        p.name as "Product Name",
        oi.quantity as "Quantity",
        oi.unit_price as "Unit Price",
        oi.subtotal as "Gross Subtotal",
        (oi.subtotal * 0.10) as "Platform Fee (10%)",
        (oi.subtotal * 0.90) as "Net Earnings",
        o.payment_status as "Payment Status",
        o.order_status as "Shipping Status"
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE p.store_id = $1 AND o.payment_status = 'SUCCESS'
      ORDER BY o.created_at DESC
    `;
    const ordersResult = await db.query(ordersQuery, [storeId]);

    // 2. Payouts History
    const payoutsQuery = `
      SELECT 
        id as "Payout ID",
        TO_CHAR(requested_at, 'YYYY-MM-DD HH24:MI:SS') as "Request Date",
        amount as "Amount",
        status as "Status",
        TO_CHAR(processed_at, 'YYYY-MM-DD HH24:MI:SS') as "Processed Date"
      FROM payouts
      WHERE vendor_id = $1
      ORDER BY requested_at DESC
    `;
    const payoutsResult = await db.query(payoutsQuery, [dbUserId]);

    // Create Excel Workbook
    const wb = xlsx.utils.book_new();
    
    const wsOrders = xlsx.utils.json_to_sheet(ordersResult.rows);
    xlsx.utils.book_append_sheet(wb, wsOrders, 'Order History & Earnings');

    const wsPayouts = xlsx.utils.json_to_sheet(payoutsResult.rows);
    xlsx.utils.book_append_sheet(wb, wsPayouts, 'Payouts');

    // Generate buffer
    const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${storeName.replace(/\\s+/g, '_')}_Analytics.xlsx"`);
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating vendor report:', error);
    require('fs').appendFileSync('vendor_report_error.log', new Date().toISOString() + ' ' + error.stack + '\n');
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Download Admin Analytics Report
// @route   GET /api/reports/admin
const getAdminReport = async (req, res) => {
  try {
    // 1. Global Platform Revenue (by Store)
    const platformQuery = `
      SELECT 
        s.name as "Store Name",
        u.email as "Vendor Email",
        COUNT(DISTINCT o.id) as "Total Orders",
        SUM(oi.subtotal) as "Gross Merchandise Value (GMV)",
        SUM(oi.subtotal * 0.10) as "Platform Revenue (10% Fee)"
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      JOIN users u ON s.owner_user_id = u.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'SUCCESS'
      GROUP BY s.name, u.email
      ORDER BY "Platform Revenue (10% Fee)" DESC
    `;
    const platformResult = await db.query(platformQuery);

    // 2. Global Orders
    const ordersQuery = `
      SELECT 
        id as "Order ID",
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "Date",
        total_amount as "Total Amount",
        payment_status as "Payment Status",
        order_status as "Shipping Status"
      FROM orders
      ORDER BY created_at DESC
    `;
    const ordersResult = await db.query(ordersQuery);

    // 3. Global Payouts
    const payoutsQuery = `
      SELECT 
        p.id as "Payout ID",
        TO_CHAR(p.requested_at, 'YYYY-MM-DD HH24:MI:SS') as "Request Date",
        s.name as "Store Name",
        p.amount as "Amount",
        p.status as "Status",
        TO_CHAR(p.processed_at, 'YYYY-MM-DD HH24:MI:SS') as "Processed Date"
      FROM payouts p
      JOIN users u ON p.vendor_id = u.id
      LEFT JOIN stores s ON s.owner_user_id = u.id
      ORDER BY p.requested_at DESC
    `;
    const payoutsResult = await db.query(payoutsQuery);

    // Create Excel Workbook
    const wb = xlsx.utils.book_new();
    
    const wsPlatform = xlsx.utils.json_to_sheet(platformResult.rows);
    xlsx.utils.book_append_sheet(wb, wsPlatform, 'Platform Revenue');

    const wsOrders = xlsx.utils.json_to_sheet(ordersResult.rows);
    xlsx.utils.book_append_sheet(wb, wsOrders, 'All Orders');

    const wsPayouts = xlsx.utils.json_to_sheet(payoutsResult.rows);
    xlsx.utils.book_append_sheet(wb, wsPayouts, 'All Payouts');

    // Generate buffer
    const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="EComVerse_Global_Report.xlsx"`);
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error generating admin report:', error);
    require('fs').appendFileSync('admin_report_error.log', new Date().toISOString() + ' ' + error.stack + '\n');
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getVendorReport,
  getAdminReport
};
