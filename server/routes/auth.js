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
    // 1. Check if user exists by clerk_user_id
    let userResult = await db.query('SELECT * FROM users WHERE clerk_user_id = $1', [userId]);
    
    if (userResult.rows.length > 0) {
      return res.json({ success: true, user: userResult.rows[0] });
    }

    // 2. Check if user exists by email (happens if you reset Clerk keys but keep the DB)
    const emailResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (emailResult.rows.length > 0) {
      // Update the existing user with the new clerk_user_id
      const updatedUser = await db.query(
        'UPDATE users SET clerk_user_id = $1 WHERE email = $2 RETURNING *',
        [userId, email]
      );
      return res.json({ success: true, user: updatedUser.rows[0] });
    }

    // 3. If neither exists, create a brand new user
    const newUserResult = await db.query(
      'INSERT INTO users (clerk_user_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name || 'New User', email || 'no-email@example.com', 'CUSTOMER']
    );

    res.json({ success: true, user: newUserResult.rows[0] });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

module.exports = router;
