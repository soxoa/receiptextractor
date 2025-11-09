require('dotenv').config();
const { query } = require('./connection');

async function addAdminSupport() {
  try {
    console.log('🔄 Adding admin support to database...');

    // Add is_admin column to users table
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
      
      CREATE INDEX IF NOT EXISTS idx_users_admin ON users(is_admin) WHERE is_admin = true;
    `);

    console.log('✅ Admin support added to database');
    
    // Set your email as admin
    const adminEmail = process.argv[2];
    
    if (adminEmail) {
      const { rows: [user] } = await query(
        'UPDATE users SET is_admin = true WHERE email = $1 RETURNING *',
        [adminEmail.toLowerCase()]
      );
      
      if (user) {
        console.log(`✅ Set ${adminEmail} as admin`);
      } else {
        console.log(`⚠️  User ${adminEmail} not found. Create an account first, then run: node src/db/add_admin.js your@email.com`);
      }
    } else {
      console.log('ℹ️  To make a user admin, run: node src/db/add_admin.js your@email.com');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add admin support:', error);
    process.exit(1);
  }
}

addAdminSupport();

