const db = require('./utils/db');

async function getSchema() {
  const query = `
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name IN ('products', 'cart_items', 'orders', 'order_items', 'stores');
  `;
  const res = await db.query(query);
  console.table(res.rows);
  process.exit(0);
}

getSchema();
