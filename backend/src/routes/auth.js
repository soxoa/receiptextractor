const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/connection');
const { sendWelcomeEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Register new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const { rows: existingUsers } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { rows: [user] } = await query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email.toLowerCase(), passwordHash, name || email.split('@')[0]]
    );

    // Create default organization for user
    const { rows: [organization] } = await query(
      `INSERT INTO organizations (name, owner_user_id)
       VALUES ($1, $2)
       RETURNING id, name`,
      [`${user.name}'s Organization`, user.id]
    );

    // Add user as owner of organization
    await query(
      `INSERT INTO organization_members (organization_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [organization.id, user.id]
    );

    // Create initial subscription (free tier)
    await query(
      `INSERT INTO subscriptions (organization_id, plan_tier, status)
       VALUES ($1, 'free', 'active')`,
      [organization.id]
    );

    // Initialize usage tracking for current month
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    await query(
      `INSERT INTO usage_tracking (organization_id, month, invoice_count)
       VALUES ($1, $2, 0)`,
      [organization.id, currentMonth]
    );

    // Create onboarding record
    await query(
      `INSERT INTO user_onboarding (user_id, organization_id)
       VALUES ($1, $2)`,
      [user.id, organization.id]
    );

    // Send welcome email (async)
    sendWelcomeEmail(user.email, user.name, organization.id)
      .catch(err => console.error('Failed to send welcome email:', err));

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, organizationId: organization.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      organization: {
        id: organization.id,
        name: organization.name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const { rows: [user] } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Get user's organizations
    const { rows: organizations } = await query(
      `SELECT o.id, o.name, om.role
       FROM organizations o
       JOIN organization_members om ON o.id = om.organization_id
       WHERE om.user_id = $1
       ORDER BY om.created_at ASC`,
      [user.id]
    );

    const primaryOrg = organizations[0]; // Use first organization

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        organizationId: primaryOrg?.id || null,
        organizationRole: primaryOrg?.role || null
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      organization: primaryOrg || null,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

/**
 * Get current user (verify token)
 */
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get fresh user data
    const { rows: [user] } = await query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      organizationId: decoded.organizationId,
      organizationRole: decoded.organizationRole
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(error);
  }
});

module.exports = router;
