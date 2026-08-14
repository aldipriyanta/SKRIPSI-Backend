const { Mobil, Merek, Kategori } = require('../models');
const { tanyaCerebras } = require('../services/cerebrasService');

async function chat(req, res) {
  const { pertanyaan } = req.body;

  if (!pertanyaan) {
    return res.status(400).json({ message: 'pertanyaan wajib diisi' });
  }

  const daftarMobil = await Mobil.findAll({
    where: { status_stok: 'tersedia' },
    include: [
      { model: Merek, attributes: ['nama_merek'] },
      { model: Kategori, attributes: ['nama_kategori'] },
    ],
  });

  const konteksMobil = daftarMobil
    .map(m => `- ${m.nama_mobil} (${m.Merek?.nama_merek}, ${m.Kategori?.nama_kategori}, ${m.tahun || '-'}, Rp${m.harga})`)
    .join('\n');

  const prompt = `Kamu adalah asisten AI showroom mobil Arjuna Motor. Tugasmu menjawab pertanyaan customer HANYA berdasarkan data stok mobil di bawah ini. Ikuti aturan ini dengan ketat:

1. Jawab HANYA berdasarkan data mobil yang ada di daftar di bawah. Field yang tersedia hanya: merek, kategori, tipe, tahun, transmisi, bahan bakar, kilometer, harga. Jangan mengarang detail lain yang tidak tertulis.
2. Kalau customer bertanya soal mobil yang TIDAK ada di daftar, jawab jujur bahwa mobil tersebut sedang tidak tersedia.
3. Kalau customer bertanya di luar topik mobil/showroom, tolak dengan sopan dan arahkan kembali ke topik mobil.
4. Untuk REKOMENDASI: pilih maksimal 2-3 mobil paling relevan dari daftar, sebutkan alasannya dalam 1 kalimat singkat per mobil.
5. Untuk PERBANDINGAN harga sepadan: bandingkan mobil dalam rentang harga 15% dari yang dibicarakan, hanya dari field yang tersedia di atas.
6. FORMAT JAWABAN: maksimal 4-6 kalimat atau poin singkat. Jangan gunakan tabel markdown, heading, atau emoji.
7. Kalau customer meminta SATU mobil dengan kombinasi kriteria tertentu (contoh: "paling murah dan tahun paling baru", "termurah tapi kilometer paling rendah"), kamu WAJIB memilih dan menyebutkan HANYA SATU mobil sebagai jawaban akhir, bukan beberapa pilihan terpisah. Cari mobil yang paling mendekati SEMUA kriteria yang diminta secara bersamaan (bukan mobil terbaik di satu kriteria lalu mobil terbaik di kriteria lain secara terpisah). Kalau tidak ada satupun mobil yang sempurna memenuhi semua kriteria, tetap pilih SATU mobil dengan kombinasi paling mendekati, lalu jelaskan secara singkat kompromi apa yang terjadi (misal: "ini yang termurah, walau tahunnya bukan yang termuda, karena tidak ada mobil yang termurah sekaligus termuda").
8. Jangan pernah menjanjikan diskon, potongan harga, garansi tambahan, test drive, atau kesepakatan apapun yang tidak tertulis di data. Kalau customer menawar harga atau minta promo, arahkan untuk menghubungi admin/sales langsung, jangan membuat kesepakatan sendiri.
9. Kalau pertanyaan customer terlalu ambigu atau kurang jelas (misal cuma "mobil bagus" tanpa kriteria spesifik), boleh bertanya balik singkat untuk klarifikasi (misal budget, kategori, atau kebutuhan), daripada menebak-nebak jawaban.
10. Jangan membandingkan mobil di showroom ini dengan mobil dari dealer/showroom lain, atau memberi opini soal merek/brand tertentu secara umum di luar data yang tersedia.

Data stok mobil yang tersedia saat ini:
${konteksMobil || 'Tidak ada mobil yang tersedia saat ini.'}

Pertanyaan customer: ${pertanyaan}`;

  try {
    const jawaban = await tanyaCerebras(prompt);
    return res.status(200).json({ jawaban });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    return res.status(500).json({ message: 'Chatbot sedang tidak bisa merespons, coba lagi nanti' });
  }
}

module.exports = { chat };