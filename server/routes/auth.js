const express = require('express');
const router = express.Router();
const { getAuth } = require('@clerk/express');
const db = require('../utils/db');

// Sync user from Clerk to our database
router.post('/sync', async (req, res) => {
  // Use getAuth to properly extract the userId
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Clerk payload is usually passed from frontend during sync,
  const { name, email } = req.body; 

  try {
    // 1. Check if user exists in our database
    const userResult = await db.query('SELECT * FROM users WHERE clerk_user_id = $1', [userId]);
    
    if (userResult.rows.length > 0) {
      // User exists, return their data
      return res.json({ success: true, user: userResult.rows[0] });
    }

    // 2. If not, create a new record in our `users` table with role 'CUSTOMER'
    // In a real app, you might want to fetch details directly from Clerk API, 
    // but taking from frontend body is okay for this sync endpoint.
    const newUserResult = await db.query(
      'INSERT INTO users (clerk_user_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name || 'New User', email || 'no-email@example.com', 'CUSTOMER']
    );

    res.json({ 
      success: true, 
      user: newUserResult.rows[0] 
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

module.exports = router;
