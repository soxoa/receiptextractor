const jwt = require('jsonwebtoken');
const { query } = require('../db/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT authentication token
 * Extracts userId and organizationId from the token
 * Attaches them to req.auth for downstream use
 */
async function requireAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid token payload' 
      });
    }

    // Get user data
    const { rows: [user] } = await query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'User not found' 
      });
    }

    // Handle organization from header or token
    let organizationId = req.headers['x-organization-id'] || decoded.organizationId;
    let organizationRole = decoded.organizationRole;

    // If organization ID provided in header, verify user has access
    if (req.headers['x-organization-id']) {
      const { rows: [membership] } = await query(
        'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
        [req.headers['x-organization-id'], user.id]
      );

      if (!membership) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'User not member of organization' 
        });
      }

      organizationRole = membership.role;
    }

    // Attach auth data to request
    req.auth = {
      userId: user.id,
      organizationId: organizationId ? parseInt(organizationId) : null,
      organizationRole,
      email: user.email,
      name: user.name,
      user
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token expired' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid token' 
      });
    }
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Failed to verify authentication' 
    });
  }
}

/**
 * Middleware to require organization membership
 */
function requireOrganization(req, res, next) {
  if (!req.auth?.organizationId) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Organization membership required' 
    });
  }
  next();
}

/**
 * Middleware to require specific organization role
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth?.organizationRole) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Organization membership required' 
      });
    }

    if (!roles.includes(req.auth.organizationRole)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireOrganization,
  requireRole
};
