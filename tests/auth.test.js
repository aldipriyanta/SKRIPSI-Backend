const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { Admin } = require('../src/models');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('rahasia123', 10);
    await Admin.create({
      nama: 'Admin Test',
      username: 'admintest',
      password: hashedPassword,
      email: 'admintest@example.com',
    });
  });

  it('berhasil login dan mengembalikan token dengan kredensial yang benar', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admintest', password: 'rahasia123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.admin.username).toBe('admintest');
  });

  it('menolak login dengan password yang salah', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admintest', password: 'salah' });

    expect(res.statusCode).toBe(401);
  });

  it('menolak login dengan username yang tidak terdaftar', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'tidakada', password: 'rahasia123' });

    expect(res.statusCode).toBe(401);
  });

  it('menolak login jika username atau password kosong', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admintest' });
    expect(res.statusCode).toBe(400);
  });
});