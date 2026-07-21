const { Mobil, Merek, PercakapanChatbot, PesanChatbot, LogPromptChatbot } = require('../models');
const { tanyaCerebras } = require('../services/cerebrasService');

async function chat(req, res) {
  const { session_id, pertanyaan } = req.body;

  if (!session_id || !pertanyaan) {
    return res.status(400).json({ message: 'session_id dan pertanyaan wajib diisi' });
  }

  let percakapan = await PercakapanChatbot.findOne({ where: { session_id } });
  if (!percakapan) {
    percakapan = await PercakapanChatbot.create({ session_id });
  }

  await PesanChatbot.create({
    id_conversation: percakapan.id_conversation,
    sender: 'customer',
    message: pertanyaan,
  });

  const daftarMobil = await Mobil.findAll({
    where: { status_stok: 'tersedia' },
    include: [{ model: Merek, attributes: ['nama_merek'] }],
  });
  const konteksMobil = daftarMobil
    .map(m => `- ${m.nama_mobil} (${m.Merek?.nama_merek || '-'}, ${m.tahun || '-'}, Rp${m.harga})`)
    .join('\n');

const prompt = `Kamu adalah asisten AI showroom mobil Arjuna Motor yang menjawab lewat chat widget singkat. Ikuti aturan ini dengan KETAT:

1. Jawab HANYA berdasarkan data yang tertulis di daftar mobil di bawah. Field yang tersedia hanya: merek, kategori, tipe, tahun, transmisi, bahan bakar, kilometer, harga. JANGAN mengarang detail lain yang tidak tertulis (misalnya jumlah kursi, reputasi merek, opini soal desain, atau klaim efisiensi bahan bakar) kecuali benar-benar tertulis di data.
2. Kalau customer bertanya soal mobil yang TIDAK ada di daftar, jawab jujur bahwa mobil tersebut sedang tidak tersedia.
3. Kalau customer bertanya di luar topik mobil/showroom, tolak dengan sopan dan arahkan kembali ke topik mobil.
4. Untuk REKOMENDASI: pilih maksimal 2-3 mobil paling relevan dari daftar, sebutkan alasannya dalam 1 kalimat singkat per mobil.
5. Untuk PERBANDINGAN harga sepadan: bandingkan mobil dalam rentang harga 15% dari yang dibicarakan, HANYA dari field yang tersedia di atas.
6. FORMAT JAWABAN: maksimal 4-6 kalimat atau poin singkat. JANGAN gunakan tabel markdown, JANGAN gunakan heading (###), JANGAN gunakan emoji. Tulis seperti pesan chat biasa, bukan artikel.

Data stok mobil yang tersedia saat ini:
${konteksMobil || 'Tidak ada mobil yang tersedia saat ini.'}

Pertanyaan customer: ${pertanyaan}`;

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
    console.error('chatbot error:', err.message);

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