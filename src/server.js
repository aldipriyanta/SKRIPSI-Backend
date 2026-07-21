require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;

function runSeeders() {
  try {
    console.log('🌱 Menjalankan seeder otomatis...');
    
    // Jalankan file seeder satu per satu
    execSync('node src/seeders/adminSeeder.js', { stdio: 'inherit' });
    execSync('node src/seeders/mobilSeeder.js', { stdio: 'inherit' });
    
    console.log('✅ Seeder selesai dijalankan!');
  } catch (error) {
    console.error('⚠️ Warning: Seeder gagal dijalankan atau data sudah ada:', error.message);
  }
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');

    // Panggil fungsi seeder sebelum server mendengarkan port
    runSeeders();

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Gagal konek ke database:', err.message);
    process.exit(1);
  }
}

start();