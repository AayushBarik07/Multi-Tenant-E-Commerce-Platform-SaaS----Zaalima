require('dotenv').config();
const db = require('./utils/db');

async function test() {
  try {
    const ordersQuery = `
      SELECT 
        id as "Order ID",
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as "Date",
        total_amount as "Total Amount",
        payment_status as "Payment Status",
        order_status as "Shipping Status"
      FROM orders
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const res = await db.query(ordersQuery);
    console.log("Admin Orders OK");

    const storeId = 'c13c7ee8-8f65-4f67-88cc-8153f3e284a1';
    
    const ordersQuery2 = `
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
      LIMIT 1
    `;
    await db.query(ordersQuery2, [storeId]);
    console.log("Vendor Orders OK");

  } catch(e) { console.error(e); }
  process.exit();
}
test();
