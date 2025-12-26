const { query } = require("../utils/dbQuery");

async function findAll() {
  const rows = await query("SELECT * FROM area_terdaftar ORDER BY id DESC LIMIT 10");
  return rows;
}

async function findById(id) {
  const rows = await query("SELECT * FROM area_terdaftar WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findByUnique({ kecamatan, kelurahan, kota, provinsi }) {
  const rows = await query(
    `SELECT * FROM area_terdaftar
     WHERE kecamatan=? AND kelurahan=? AND kota=? AND provinsi=?`,
    [kecamatan, kelurahan, kota, provinsi]
  );
  return rows[0] || null;
}

async function create({ kecamatan, kelurahan, kota, provinsi, jalan }) {
  const result = await query(
    `INSERT INTO area_terdaftar (kecamatan, kelurahan, kota, provinsi, jalan)
     VALUES (?, ?, ?, ?, ?)`,
    [kecamatan, kelurahan, kota, provinsi, jalan]  
  );
  return findById(result.insertId);
}

async function update(id, { kecamatan, kelurahan, kota, provinsi, jalan }) {
  await query(
    `UPDATE area_terdaftar
     SET kecamatan=?, kelurahan=?, kota=?, provinsi=?, jalan=?
     WHERE id=?`,
    [kecamatan, kelurahan, kota, provinsi, jalan, id]
  );
  return findById(id);
}

async function remove(id) {
  await query("DELETE FROM area_terdaftar WHERE id=?", [id]);
  return true;
}

module.exports = { findAll, findById, findByUnique, create, update, remove };
