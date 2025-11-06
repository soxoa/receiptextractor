const { clerkClient } = require('@clerk/clerk-sdk-node');

/**
 * Middleware to verify Clerk authentication token
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

    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySession(
      req.headers['clerk-session-id'] || '',
      token
    );

    if (!session || !session.userId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid session token' 
      });
    }

    // Get user data
    const user = await clerkClient.users.getUser(session.userId);
    
    // Get organization memberships
    const orgMemberships = await clerkClient.users.getOrganizationMembershipList({
      userId: session.userId
    });

    // Use the active organization or the first one
    let organizationId = null;
    let organizationRole = null;

    if (orgMemberships.data && orgMemberships.data.length > 0) {
      // Prefer the organization from the request header if provided
      const requestedOrgId = req.headers['x-organization-id'];
      
      if (requestedOrgId) {
        const membership = orgMemberships.data.find(
          m => m.organization.id === requestedOrgId
        );
        if (membership) {
          organizationId = membership.organization.id;
          organizationRole = membership.role;
        }
      }
      
      // Otherwise use the first organization
      if (!organizationId) {
        organizationId = orgMemberships.data[0].organization.id;
        organizationRole = orgMemberships.data[0].role;
      }
    }

    // Attach auth data to request
    req.auth = {
      userId: session.userId,
      organizationId,
      organizationRole,
      email: user.emailAddresses[0]?.emailAddress,
      user
    };

    next();
  } catch (error) {
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

