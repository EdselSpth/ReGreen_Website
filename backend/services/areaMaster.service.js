// services/areaMaster.service.js
const repo = require("../repositories/areaMaster.repository");

// Fungsi untuk validasi payload sebelum melakukan operasi ke database
function validatePayload(payload) {
  const kecamatan = payload.kecamatan?.trim();
  const kelurahan = payload.kelurahan?.trim();
  const kota = payload.kota?.trim();
  const provinsi = payload.provinsi?.trim();
  const jalan = payload.jalan?.trim();  // Validasi untuk nama jalan

  // Cek apakah semua field wajib sudah terisi
  if (!kecamatan || !kelurahan || !kota || !provinsi || !jalan) {  // cek jalan
    const err = new Error("Field wajib: kecamatan, kelurahan, kota, provinsi, jalan");
    err.statusCode = 400; // Status kode 400 untuk Bad Request
    throw err;
  }

  // Kembalikan payload yang telah diproses (clean)
  return { kecamatan, kelurahan, kota, provinsi, jalan };
}

// Fungsi untuk membuat area baru
async function create(payload) {
  const clean = validatePayload(payload);  // Validasi input sebelum menambah

  // Cek apakah area yang sama sudah terdaftar
  const exists = await repo.findByUnique(clean);
  if (exists) {
    const err = new Error("Area sudah terdaftar (duplikat)");
    err.statusCode = 409; // Status kode 409 untuk Conflict (data duplikat)
    throw err;
  }

  // Jika tidak ada duplikat, lanjutkan untuk menambah data ke database
  return repo.create(clean); // Fungsi ini akan menambah data area ke database
}

// Fungsi untuk memastikan area sudah terdaftar (untuk update)
async function ensureAreaRegistered(payload) {
  const clean = validatePayload(payload); // Validasi input sebelum memastikan

  // Cek apakah area yang sama sudah terdaftar
  const exists = await repo.findByUnique(clean);
  if (exists) return exists; // Jika sudah ada, kembalikan data yang ada (idempotent)

  // Jika belum ada, lanjutkan untuk menambah data ke database
  return repo.create(clean); // Fungsi ini akan menambah data area ke database
}

module.exports = { list, getById, create, update, remove, ensureAreaRegistered };
