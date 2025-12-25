const db = require("../config/db");

class JenisSampahRepository {
  static findAll(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM jenis_sampah ORDER BY nama_jenis ASC LIMIT ? OFFSET ?";
      db.query(sql, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static countAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) as total FROM jenis_sampah";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0].total);
      });
    });
  }

  static searchEngine(keyword, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nama_jenis, harga_per_kg
        FROM jenis_sampah
        WHERE nama_jenis LIKE ?
        ORDER BY nama_jenis ASC
        LIMIT ? OFFSET ?
      `;
      const searchKeyword = `%${keyword}%`;

      db.query(sql, [searchKeyword, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static countSearch(keyword) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) as total FROM jenis_sampah WHERE nama_jenis LIKE ?";
      const searchKeyword = `%${keyword}%`;

      db.query(sql, [searchKeyword], (err, rows) => { // ✅ hanya 1 parameter
        if (err) reject(err);
        else resolve(rows[0].total);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM jenis_sampah WHERE id = ?";
      db.query(sql, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO jenis_sampah (nama_jenis, harga_per_kg)
        VALUES (?, ?)
      `;
      db.query(sql, [data.nama_jenis, data.harga_per_kg], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE jenis_sampah
        SET nama_jenis = ?, harga_per_kg = ?
        WHERE id = ?
      `;
      db.query(sql, [data.nama_jenis, data.harga_per_kg, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM jenis_sampah WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = JenisSampahRepository;
