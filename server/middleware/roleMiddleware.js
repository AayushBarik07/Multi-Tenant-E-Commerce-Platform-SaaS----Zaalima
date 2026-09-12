const db = require('../utils/db');

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.auth;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Fetch user's role from Supabase DB using clerk_user_id (userId)
      const userResult = await db.query('SELECT role FROM users WHERE clerk_user_id = $1', [userId]);
      const userRole = userResult.rows[0]?.role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      // Attach user role to request for downstream handlers
      req.userRole = userRole;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

const requireVendor = requireRole(['VENDOR', 'SUPER_ADMIN']);
const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

module.exports = {
  requireRole,
  requireVendor,
  requireSuperAdmin
};
