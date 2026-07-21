require('dotenv').config();
const { sequelize, Admin, Merek, Kategori, Mobil } = require('../models');

const dataMerek = ['Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi'];
const dataKategori = ['MPV', 'SUV', 'Hatchback', 'Sedan', 'City Car'];

const dataMobil = [
  { nama_mobil: 'Avanza', merek: 'Toyota', kategori: 'MPV', tipe: 'G', tahun: 2022, transmisi: 'Manual', bahan_bakar: 'Bensin', kilometer: 15000, harga: 185000000, deskripsi: 'Kondisi terawat, service record lengkap, siap pakai.' },
  { nama_mobil: 'Innova Reborn', merek: 'Toyota', kategori: 'MPV', tipe: 'Venturer', tahun: 2021, transmisi: 'Automatic', bahan_bakar: 'Diesel', kilometer: 22000, harga: 385000000, deskripsi: 'Interior mewah, mesin diesel bertenaga, cocok untuk keluarga.' },
  { nama_mobil: 'Brio Satya', merek: 'Honda', kategori: 'Hatchback', tipe: 'E', tahun: 2023, transmisi: 'Manual', bahan_bakar: 'Bensin', kilometer: 8000, harga: 165000000, deskripsi: 'Irit bahan bakar, cocok untuk harian di kota.' },
  { nama_mobil: 'HR-V', merek: 'Honda', kategori: 'SUV', tipe: 'RS', tahun: 2022, transmisi: 'Automatic', bahan_bakar: 'Bensin', kilometer: 18000, harga: 385000000, deskripsi: 'Tampilan sporty, fitur lengkap, kondisi mulus.' },
  { nama_mobil: 'Xenia', merek: 'Daihatsu', kategori: 'MPV', tipe: 'R', tahun: 2021, transmisi: 'Manual', bahan_bakar: 'Bensin', kilometer: 25000, harga: 155000000, deskripsi: 'Kabin luas, perawatan mudah, harga bersahabat.' },
  { nama_mobil: 'Ayla', merek: 'Daihatsu', kategori: 'City Car', tipe: 'X', tahun: 2023, transmisi: 'Automatic', bahan_bakar: 'Bensin', kilometer: 6000, harga: 145000000, deskripsi: 'Mobil kota yang lincah dan hemat bahan bakar.' },
  { nama_mobil: 'Ertiga', merek: 'Suzuki', kategori: 'MPV', tipe: 'GX', tahun: 2022, transmisi: 'Automatic', bahan_bakar: 'Bensin', kilometer: 17000, harga: 205000000, deskripsi: 'Nyaman untuk perjalanan jauh, kabin lapang.' },
  { nama_mobil: 'XL7', merek: 'Suzuki', kategori: 'SUV', tipe: 'Beta', tahun: 2023, transmisi: 'Manual', bahan_bakar: 'Bensin', kilometer: 9000, harga: 235000000, deskripsi: 'Desain SUV modern, ground clearance tinggi.' },
  { nama_mobil: 'Xpander', merek: 'Mitsubishi', kategori: 'MPV', tipe: 'Ultimate', tahun: 2022, transmisi: 'Automatic', bahan_bakar: 'Bensin', kilometer: 20000, harga: 255000000, deskripsi: 'Fitur lengkap, tampilan elegan, sudah terjual.', terjual: true },
  { nama_mobil: 'Civic Sedan', merek: 'Honda', kategori: 'Sedan', tipe: 'RS Turbo', tahun: 2021, transmisi: 'Automatic', bahan_bakar: 'Bensin', kilometer: 24000, harga: 495000000, deskripsi: 'Sedan sporty dengan performa turbo, kondisi istimewa.' },
];

async function seed() {
  await sequelize.sync();

  const admin = await Admin.findOne({ where: { username: 'admin' } });
  if (!admin) {
    console.log('Admin default belum ada. Jalankan "npm run seed" (adminSeeder) dulu.');
    return process.exit(1);
  }

  const existingMobil = await Mobil.count();
  if (existingMobil > 0) {
    console.log(`Sudah ada ${existingMobil} data mobil di database. Seeder dilewati.`);
    return process.exit(0);
  }

  const merekMap = {};
  for (const nama of dataMerek) {
    const [merek] = await Merek.findOrCreate({ where: { nama_merek: nama } });
    merekMap[nama] = merek.id_merek;
  }

  const kategoriMap = {};
  for (const nama of dataKategori) {
    const [kategori] = await Kategori.findOrCreate({ where: { nama_kategori: nama } });
    kategoriMap[nama] = kategori.id_kategori;
  }

  for (const mobil of dataMobil) {
    await Mobil.create({
      id_admin: admin.id_admin,
      nama_mobil: mobil.nama_mobil,
      id_merek: merekMap[mobil.merek],
      id_kategori: kategoriMap[mobil.kategori],
      tipe: mobil.tipe,
      tahun: mobil.tahun,
      transmisi: mobil.transmisi,
      bahan_bakar: mobil.bahan_bakar,
      kilometer: mobil.kilometer,
      harga: mobil.harga,
      deskripsi: mobil.deskripsi,
      status_stok: mobil.terjual ? 'terjual' : 'tersedia',
    });
  }

  console.log(`Berhasil menambahkan ${dataMobil.length} data mobil contoh ke database.`);
  process.exit(0);
}

seed();