const db = require("../config/db");

class ArtikelRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM artikel ORDER BY created_at DESC";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM artikel WHERE id = ?";
      db.query(sql, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO artikel (nama_artikel, file_pdf)
        VALUES (?, ?)
      `;
      db.query(
        sql,
        [data.nama_artikel, data.file_pdf],
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
        UPDATE artikel
        SET nama_artikel = ?, file_pdf = ?
        WHERE id = ?
      `;
      db.query(
        sql,
        [data.nama_artikel, data.file_pdf, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM artikel WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = ArtikelRepository;
