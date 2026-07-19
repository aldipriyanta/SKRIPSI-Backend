const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, Mobil, Merek, Kategori } = require('../src/models');

let token;
let merekId;
let kategoriId;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('rahasia123', 10);
  await Admin.create({
    nama: 'Admin Mobil', username: 'adminmobil', password: hashedPassword, email: 'adminmobil@example.com',
  });

  const loginRes = await request(app).post('/api/auth/login').send({ username: 'adminmobil', password: 'rahasia123' });
  token = loginRes.body.token;

  const merek = await Merek.create({ nama_merek: 'Toyota' });
  const kategori = await Kategori.create({ nama_kategori: 'MPV' });
  merekId = merek.id_merek;
  kategoriId = kategori.id_kategori;
});

describe('GET /api/mobil', () => {
  it('mengembalikan daftar mobil tanpa perlu login', async () => {
    const res = await request(app).get('/api/mobil');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/mobil', () => {
  it('menolak membuat data mobil tanpa token', async () => {
    const res = await request(app).post('/api/mobil').send({
      nama_mobil: 'Avanza', id_merek: merekId, id_kategori: kategoriId, harga: 150000000,
    });
    expect(res.statusCode).toBe(401);
  });

  it('menolak membuat data mobil jika field wajib kosong', async () => {
    const res = await request(app)
      .post('/api/mobil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_mobil: 'Avanza' });
    expect(res.statusCode).toBe(400);
  });

  it('berhasil membuat data mobil baru dengan token admin yang valid', async () => {
    const res = await request(app)
      .post('/api/mobil')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nama_mobil: 'Avanza', id_merek: merekId, id_kategori: kategoriId, tipe: 'G',
        tahun: 2022, transmisi: 'Manual', bahan_bakar: 'Bensin',
        kilometer: 15000, harga: 185000000, deskripsi: 'Kondisi terawat',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.nama_mobil).toBe('Avanza');
    expect(res.body.data.status_stok).toBe('tersedia');
  });
});

describe('GET /api/mobil/:id', () => {
  it('mengembalikan detail mobil jika ditemukan', async () => {
    const mobil = await Mobil.create({
      id_admin: 1, nama_mobil: 'Xenia', id_merek: merekId, id_kategori: kategoriId, harga: 140000000,
    });
    const res = await request(app).get(`/api/mobil/${mobil.id_mobil}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.nama_mobil).toBe('Xenia');
  });

  it('mengembalikan 404 jika mobil tidak ditemukan', async () => {
    const res = await request(app).get('/api/mobil/9999');
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/mobil/:id', () => {
  it('berhasil memperbarui data mobil dengan token yang valid', async () => {
    const mobil = await Mobil.create({
      id_admin: 1, nama_mobil: 'Brio', id_merek: merekId, id_kategori: kategoriId, harga: 130000000,
    });
    const res = await request(app)
      .put(`/api/mobil/${mobil.id_mobil}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status_stok: 'terjual' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status_stok).toBe('terjual');
  });
});

describe('DELETE /api/mobil/:id', () => {
  it('berhasil menghapus data mobil dengan token yang valid', async () => {
    const mobil = await Mobil.create({
      id_admin: 1, nama_mobil: 'Ayla', id_merek: merekId, id_kategori: kategoriId, harga: 120000000,
    });
    const res = await request(app)
      .delete(`/api/mobil/${mobil.id_mobil}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('mengembalikan 404 saat menghapus mobil yang tidak ada', async () => {
    const res = await request(app)
      .delete('/api/mobil/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});