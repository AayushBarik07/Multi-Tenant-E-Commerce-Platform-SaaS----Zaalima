require('dotenv').config();
const db = require('./utils/db');
async function test() {
  try {
    const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items'");
    console.log("order_items:", res.rows.map(r => r.column_name));
    
    const res2 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
    console.log("products:", res2.rows.map(r => r.column_name));
    
    const res3 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'stores'");
    console.log("stores:", res3.rows.map(r => r.column_name));
  } catch(e) { console.error(e); }
  process.exit();
}
test();
