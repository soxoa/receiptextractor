require('dotenv').config();
const { query } = require('./connection');

async function resetAndMigrate() {
  try {
    console.log('🔄 Dropping existing tables...');
    
    // Drop all tables in correct order (reverse of dependencies)
    await query(`
      DROP TABLE IF EXISTS user_onboarding CASCADE;
      DROP TABLE IF EXISTS emails CASCADE;
      DROP TABLE IF EXISTS discrepancies CASCADE;
      DROP TABLE IF EXISTS invoice_line_items CASCADE;
      DROP TABLE IF EXISTS invoices CASCADE;
      DROP TABLE IF EXISTS price_agreement_items CASCADE;
      DROP TABLE IF EXISTS price_agreements CASCADE;
      DROP TABLE IF EXISTS vendors CASCADE;
      DROP TABLE IF EXISTS usage_tracking CASCADE;
      DROP TABLE IF EXISTS subscriptions CASCADE;
      DROP TABLE IF EXISTS organization_members CASCADE;
      DROP TABLE IF EXISTS organizations CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('✅ Tables dropped');
    console.log('🔄 Running fresh migrations...');

    // Now run fresh migrations
    const { exec } = require('child_process');
    exec('node src/db/migrate.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(stdout);
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetAndMigrate();

