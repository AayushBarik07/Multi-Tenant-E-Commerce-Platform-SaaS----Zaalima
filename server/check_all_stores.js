require('dotenv').config();
const db = require('./utils/db');

async function checkAllStores() {
  try {
    const stores = await db.query(`
      SELECT s.id, s.name, s.owner_user_id, u.name as owner_name, u.email, u.role
      FROM stores s
      JOIN users u ON s.owner_user_id = u.id
    `);
    console.log('All Stores in DB:', stores.rows);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

checkAllStores();
