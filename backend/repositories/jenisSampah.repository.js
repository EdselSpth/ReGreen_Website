const db = require("../config/db");

class JenisSampahRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM jenis_sampah ORDER BY nama_jenis ASC";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
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
      db.query(
        sql,
        [data.nama_jenis, data.harga_per_kg],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE jenis_sampah
        SET nama_jenis = ?, harga_per_kg = ?
        WHERE id = ?
      `;
      db.query(
        sql,
        [data.nama_jenis, data.harga_per_kg, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
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
