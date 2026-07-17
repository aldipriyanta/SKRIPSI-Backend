require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');

async function seed() {
  await sequelize.sync();

  const existing = await Admin.findOne({ where: { username: 'admin' } });
  if (existing) {
    console.log('Admin default sudah ada, seeder dilewati.');
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await Admin.create({
    nama: 'Admin Arjuna Motor',
    username: 'admin',
    password: hashedPassword,
    email: 'admin@arjunamotor.com',
  });

  console.log('Admin default berhasil dibuat -> username: admin | password: admin123');
  process.exit(0);
}

seed();