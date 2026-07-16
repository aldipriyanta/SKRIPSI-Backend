const request = require('supertest');
const path = require('path');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, Mobil, GambarMobil } = require('../src/models');

let token;
let mobilId;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('rahasia123', 10);
  await Admin.create({
    nama: 'Admin Gambar',
    username: 'admingambar',
    password: hashedPassword,
    email: 'admingambar@example.com',
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admingambar', password: 'rahasia123' });
  token = loginRes.body.token;

  const mobil = await Mobil.create({
    id_admin: 1,
    nama_mobil: 'Innova',
    merek: 'Toyota',
    kategori: 'MPV',
    harga: 250000000,
  });
  mobilId = mobil.id_mobil;
});

describe('POST /api/mobil/:id/gambar', () => {
  it('menolak upload tanpa token', async () => {
    const res = await request(app)
      .post(`/api/mobil/${mobilId}/gambar`)
      //.attach('gambar', path.join(__dirname, 'fixtures', 'test-image.png'));
    expect(res.statusCode).toBe(401);
  });

  it('menolak upload jika tidak ada file', async () => {
    const res = await request(app)
      .post(`/api/mobil/${mobilId}/gambar`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(400);
  });

  it('berhasil upload gambar dengan token yang valid', async () => {
    const res = await request(app)
      .post(`/api/mobil/${mobilId}/gambar`)
      .set('Authorization', `Bearer ${token}`)
      .attach('gambar', path.join(__dirname, 'fixtures', 'test-image.png'))
      .field('keterangan', 'Tampak depan');

    expect(res.statusCode).toBe(201);
    expect(res.body.data.url_gambar).toMatch(/\/uploads\/mobil\//);
  });

  it('mengembalikan 404 jika mobil tidak ditemukan', async () => {
    const res = await request(app)
      .post('/api/mobil/9999/gambar')
      .set('Authorization', `Bearer ${token}`)
      .attach('gambar', path.join(__dirname, 'fixtures', 'test-image.png'));
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /api/mobil/:id/gambar', () => {
  it('mengembalikan daftar gambar mobil tanpa perlu login', async () => {
    const res = await request(app).get(`/api/mobil/${mobilId}/gambar`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('DELETE /api/mobil/gambar/:id_gambar', () => {
  it('berhasil menghapus gambar dengan token yang valid', async () => {
    const gambar = await GambarMobil.create({
      id_mobil: mobilId,
      url_gambar: '/uploads/mobil/dummy.png',
    });

    const res = await request(app)
      .delete(`/api/mobil/gambar/${gambar.id_gambar}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('mengembalikan 404 jika gambar tidak ditemukan', async () => {
    const res = await request(app)
      .delete('/api/mobil/gambar/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});