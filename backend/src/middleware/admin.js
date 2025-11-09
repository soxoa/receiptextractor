const { query } = require('../db/connection');

/**
 * Middleware to require admin privileges
 * Must be used AFTER requireAuth middleware
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }

    // Check if user is admin
    const { rows: [user] } = await query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.auth.userId]
    );

    if (!user || !user.is_admin) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Admin access required' 
      });
    }

    req.auth.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

module.exports = {
  requireAdmin
};

