require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function seedAdmin() {
  try {
    const email = 'admin@example.com';
    const password = 'Admin123';

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE role = 'admin'`,
      ['Admin User', email, passwordHash, 'admin']
    );

    console.log('✅ Admin seeded successfully');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();