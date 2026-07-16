const { Mobil, PercakapanChatbot, PesanChatbot, LogPromptChatbot } = require('../models');
const { tanyaCerebras } = require('../services/cerebrasService');

async function chat(req, res) {
  const { session_id, pertanyaan } = req.body;

  if (!session_id || !pertanyaan) {
    return res.status(400).json({ message: 'session_id dan pertanyaan wajib diisi' });
  }

  // Cari atau buat percakapan baru berdasarkan session_id
  let percakapan = await PercakapanChatbot.findOne({ where: { session_id } });
  if (!percakapan) {
    percakapan = await PercakapanChatbot.create({ session_id });
  }

  // Simpan pesan customer
  await PesanChatbot.create({
    id_conversation: percakapan.id_conversation,
    sender: 'customer',
    message: pertanyaan,
  });

  // Ambil data mobil sebagai konteks buat AI
  const daftarMobil = await Mobil.findAll({ where: { status_stok: 'tersedia' } });
  const konteksMobil = daftarMobil
    .map(m => `- ${m.nama_mobil} (${m.merek}, ${m.tahun || '-'}, Rp${m.harga})`)
    .join('\n');

  const prompt = `Kamu adalah asisten showroom mobil Arjuna Motor. Jawab pertanyaan customer berdasarkan data mobil berikut:\n${konteksMobil}\n\nPertanyaan customer: ${pertanyaan}`;

  try {
    const jawaban = await tanyaCerebras(prompt);

    await LogPromptChatbot.create({
      id_conversation: percakapan.id_conversation,
      user_question: pertanyaan,
      generated_prompt: prompt,
      ai_response: jawaban,
      ai_status: 'success',
    });

    await PesanChatbot.create({
      id_conversation: percakapan.id_conversation,
      sender: 'bot',
      message: jawaban,
    });

    return res.status(200).json({ jawaban });
  } catch (err) {
    await LogPromptChatbot.create({
      id_conversation: percakapan.id_conversation,
      user_question: pertanyaan,
      generated_prompt: prompt,
      ai_response: null,
      ai_status: 'failed',
    });

    return res.status(500).json({ message: 'Chatbot sedang tidak bisa merespons, coba lagi nanti' });
  }
}

module.exports = { chat };