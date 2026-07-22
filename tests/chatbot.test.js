jest.mock('../src/services/cerebrasService');
const { tanyaCerebras } = require('../src/services/cerebrasService');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, Mobil, Merek, Kategori } = require('../src/models');

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('rahasia123', 10);
  const admin = await Admin.create({
    nama: 'Admin Chatbot', username: 'adminchatbot', password: hashedPassword, email: 'adminchatbot@example.com',
  });
  const merek = await Merek.create({ nama_merek: 'Toyota' });
  const kategori = await Kategori.create({ nama_kategori: 'MPV' });
  await Mobil.create({
    id_admin: admin.id_admin, nama_mobil: 'Avanza',
    id_merek: merek.id_merek, id_kategori: kategori.id_kategori, harga: 185000000,
  });
});

describe('POST /api/chatbot', () => {
  it('menolak jika pertanyaan kosong', async () => {
    const res = await request(app).post('/api/chatbot').send({});
    expect(res.statusCode).toBe(400);
  });

  it('berhasil membalas pertanyaan berdasarkan data stok', async () => {
    tanyaCerebras.mockResolvedValue('Kami punya Toyota Avanza harga 185 juta.');
    const res = await request(app).post('/api/chatbot').send({ pertanyaan: 'Ada mobil Avanza?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.jawaban).toBe('Kami punya Toyota Avanza harga 185 juta.');
    expect(tanyaCerebras).toHaveBeenCalledTimes(1);
  });

  it('mengembalikan 500 jika Cerebras error', async () => {
    tanyaCerebras.mockRejectedValue(new Error('Cerebras API error: 500'));
    const res = await request(app).post('/api/chatbot').send({ pertanyaan: 'Test error' });
    expect(res.statusCode).toBe(500);
  });
});