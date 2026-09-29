require('dotenv').config();
const db = require('./utils/db');

async function updateOrderPrices() {
  try {
    console.log('Updating order_items unit_price...');
    await db.query(`
      UPDATE order_items oi
      SET unit_price = p.price
      FROM products p
      WHERE oi.product_id = p.id;
    `);
    
    console.log('Updating order_items subtotal...');
    await db.query(`
      UPDATE order_items
      SET subtotal = unit_price * quantity;
    `);
    
    console.log('Updating orders total_amount...');
    await db.query(`
      UPDATE orders o
      SET total_amount = subquery.new_total
      FROM (
        SELECT order_id, SUM(subtotal) as new_total
        FROM order_items
        GROUP BY order_id
      ) as subquery
      WHERE o.id = subquery.order_id;
    `);
    
    console.log('Successfully updated all past orders with new rupee pricing scale!');
    
  } catch (error) {
    console.error('Failed to update orders:', error);
  } finally {
    process.exit();
  }
}

updateOrderPrices();
