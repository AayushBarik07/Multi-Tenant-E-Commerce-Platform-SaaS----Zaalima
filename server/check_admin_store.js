require('dotenv').config();
const db = require('./utils/db');

async function checkData() {
  try {
    const users = await db.query("SELECT id, name, email, role FROM users WHERE role = 'SUPER_ADMIN'");
    console.log('Admins:', users.rows);
    
    if (users.rows.length > 0) {
      const adminId = users.rows[0].id;
      const stores = await db.query('SELECT * FROM stores WHERE owner_user_id = $1', [adminId]);
      console.log('Admin Stores:', stores.rows);
      
      if (stores.rows.length > 0) {
        const storeId = stores.rows[0].id;
        
        const products = await db.query('SELECT count(*) FROM products WHERE store_id = $1', [storeId]);
        console.log('Admin Products:', products.rows[0].count);
        
        const orders = await db.query(`
          SELECT count(*) 
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.id 
          WHERE p.store_id = $1
        `, [storeId]);
        console.log('Admin Order Items:', orders.rows[0].count);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

checkData();
