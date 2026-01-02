const repo = require("../repositories/areaMaster.repository");

function validatePayload(payload) {
  const kecamatan = payload.kecamatan?.trim();
  const kelurahan = payload.kelurahan?.trim() || "-";
  const kota = payload.kota?.trim() || "-";
  const provinsi = payload.provinsi?.trim() || "-";
  const jalan = payload.jalan?.trim() || "-";

  if (!kecamatan) {
    const err = new Error("Field wajib: kecamatan");
    err.statusCode = 400;
    throw err;
  }
  return { kecamatan, kelurahan, kota, provinsi, jalan };
}

async function create(payload) {
  const clean = validatePayload(payload);

  const existing = await repo.findByAddress(clean);
  if (existing) {
    console.log("Area sudah terdaftar:");
    return existing;
  }

  return repo.create(clean);
}

async function list() {
  return await repo.findAll();
}

module.exports = { create, list };