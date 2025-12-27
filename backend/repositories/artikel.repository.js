const db = require("../config/db");

class ArtikelRepository {
  static findAll(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM artikel ORDER BY nama_artikel DESC LIMIT ? OFFSET ?";
      db.query(sql, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
  
  static countAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) as total FROM artikel";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0].total);
      });
    });
  }

  static searchEngine(keyword, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nama_artikel, file_pdf
        FROM artikel
        WHERE nama_artikel LIKE ? OR file_pdf LIKE ?
        ORDER BY nama_artikel ASC
        LIMIT ? OFFSET ?
      `;
      const searchKeyword = `%${keyword}%`;

      db.query(
        sql,
        [searchKeyword, searchKeyword, limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static countSearch(keyword) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT COUNT(*) as total FROM artikel WHERE nama_artikel LIKE ?";
      const searchKeyword = `%${keyword}%`;

      db.query(sql, [searchKeyword], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0].total);
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
      db.query(sql, [data.nama_artikel, data.file_pdf], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static update(id, data) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE artikel
        SET nama_artikel = ?, file_pdf = ?
        WHERE id = ?
      `;
      db.query(sql, [data.nama_artikel, data.file_pdf, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
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
