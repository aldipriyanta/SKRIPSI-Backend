const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, Merek, Kategori } = require('../src/models');

let token;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('rahasia123', 10);
  await Admin.create({
    nama: 'Admin Referensi', username: 'adminref', password: hashedPassword, email: 'adminref@example.com',
  });
  const loginRes = await request(app).post('/api/auth/login').send({ username: 'adminref', password: 'rahasia123' });
  token = loginRes.body.token;
});

describe('GET /api/merek', () => {
  it('mengembalikan daftar merek tanpa perlu login', async () => {
    await Merek.create({ nama_merek: 'Toyota' });
    const res = await request(app).get('/api/merek');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/merek', () => {
  it('menolak tanpa token', async () => {
    const res = await request(app).post('/api/merek').send({ nama_merek: 'Honda' });
    expect(res.statusCode).toBe(401);
  });

  it('berhasil menambah merek baru dengan token', async () => {
    const res = await request(app)
      .post('/api/merek')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_merek: 'Daihatsu' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.nama_merek).toBe('Daihatsu');
  });
});

describe('GET /api/kategori', () => {
  it('mengembalikan daftar kategori tanpa perlu login', async () => {
    await Kategori.create({ nama_kategori: 'MPV' });
    const res = await request(app).get('/api/kategori');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/kategori', () => {
  it('menolak tanpa token', async () => {
    const res = await request(app).post('/api/kategori').send({ nama_kategori: 'Sedan' });
    expect(res.statusCode).toBe(401);
  });

  it('berhasil menambah kategori baru dengan token', async () => {
    const res = await request(app)
      .post('/api/kategori')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_kategori: 'Hatchback' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.nama_kategori).toBe('Hatchback');
  });
});