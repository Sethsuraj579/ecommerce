// backend/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email: 'admin@shop.com' });
  if (existing) { console.log('Admin already exists'); process.exit(); }
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@shop.com',
    password: hashed,
    role: 'admin'
  });
  console.log('✅ Admin created: admin@shop.com / admin123');
  process.exit();
}
createAdmin();