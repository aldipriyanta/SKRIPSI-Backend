jest.mock('../src/services/cerebrasService');
const { tanyaCerebras } = require('../src/services/cerebrasService');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin, Mobil, Merek, Kategori, PercakapanChatbot, PesanChatbot, LogPromptChatbot } = require('../src/models');

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
    id_admin: admin.id_admin,
    nama_mobil: 'Avanza',
    id_merek: merek.id_merek,
    id_kategori: kategori.id_kategori,
    harga: 185000000,
  });
});

describe('POST /api/chatbot', () => {
  it('menolak jika pertanyaan kosong', async () => {
    const res = await request(app).post('/api/chatbot').send({ session_id: 'abc123' });
    expect(res.statusCode).toBe(400);
  });

  it('berhasil membalas pertanyaan dan menyimpan log prompt', async () => {
    tanyaCerebras.mockResolvedValue('Kami punya Toyota Avanza harga 185 juta.');

    const res = await request(app)
      .post('/api/chatbot')
      .send({ session_id: 'abc123', pertanyaan: 'Ada mobil Avanza?' });

    expect(res.statusCode).toBe(200);
    expect(res.body.jawaban).toBe('Kami punya Toyota Avanza harga 185 juta.');
    expect(tanyaCerebras).toHaveBeenCalledTimes(1);

    const log = await LogPromptChatbot.findOne({ where: { user_question: 'Ada mobil Avanza?' } });
    expect(log).not.toBeNull();
    expect(log.ai_status).toBe('success');
  });

  it('membuat percakapan baru otomatis kalau session_id belum ada', async () => {
    tanyaCerebras.mockResolvedValue('Halo, ada yang bisa dibantu?');

    await request(app).post('/api/chatbot').send({ session_id: 'sesi-baru', pertanyaan: 'Halo' });

    const percakapan = await PercakapanChatbot.findOne({ where: { session_id: 'sesi-baru' } });
    expect(percakapan).not.toBeNull();
  });

  it('menyimpan pesan customer dan bot ke pesan_chatbot', async () => {
    tanyaCerebras.mockResolvedValue('Jawaban bot');

    await request(app).post('/api/chatbot').send({ session_id: 'sesi-pesan', pertanyaan: 'Test pesan' });

    const percakapan = await PercakapanChatbot.findOne({ where: { session_id: 'sesi-pesan' } });
    const pesan = await PesanChatbot.findAll({ where: { id_conversation: percakapan.id_conversation } });

    expect(pesan.length).toBe(2);
    expect(pesan.find(p => p.sender === 'customer').message).toBe('Test pesan');
    expect(pesan.find(p => p.sender === 'bot').message).toBe('Jawaban bot');
  });

  it('mengembalikan 500 dan mencatat log gagal jika Cerebras error', async () => {
    tanyaCerebras.mockRejectedValue(new Error('Cerebras API error: 500'));

    const res = await request(app)
      .post('/api/chatbot')
      .send({ session_id: 'sesi-error', pertanyaan: 'Test error' });

    expect(res.statusCode).toBe(500);

    const log = await LogPromptChatbot.findOne({ where: { user_question: 'Test error' } });
    expect(log.ai_status).toBe('failed');
  });
});