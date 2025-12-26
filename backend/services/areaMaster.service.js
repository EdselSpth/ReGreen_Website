// services/areaMaster.service.js
const repo = require("../repositories/areaMaster.repository");

// Fungsi untuk validasi payload sebelum melakukan operasi ke database
function validatePayload(payload) {
  const kecamatan = payload.kecamatan?.trim();
  const kelurahan = payload.kelurahan?.trim();
  const kota = payload.kota?.trim();
  const provinsi = payload.provinsi?.trim();
  const jalan = payload.jalan?.trim();  // Validasi untuk nama jalan

  if (!kecamatan || !kelurahan || !kota || !provinsi || !jalan) {
    const err = new Error("Field wajib: kecamatan, kelurahan, kota, provinsi, jalan");
    err.statusCode = 400;
    throw err;
  }

  return { kecamatan, kelurahan, kota, provinsi, jalan };
}

// Fungsi untuk membuat area baru
async function create(payload) {
  const clean = validatePayload(payload);

  const exists = await repo.findByUnique(clean);
  if (exists) {
    const err = new Error("Area sudah terdaftar (duplikat)");
    err.statusCode = 409;
    throw err;
  }

  return repo.create(clean);
}

// Fungsi untuk memastikan area sudah terdaftar (untuk update)
async function ensureAreaRegistered(payload) {
  const clean = validatePayload(payload);

  const exists = await repo.findByUnique(clean);
  if (exists) return exists;

  return repo.create(clean);
}

// ✅ Export hanya fungsi yang ada
module.exports = { create, ensureAreaRegistered };
