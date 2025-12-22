const db = require("../config/db");

class KeuntunganRepository {
  static findPending() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM penarikan_keuntungan WHERE status = 'pending' ORDER BY created_at DESC";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM penarikan_keuntungan WHERE id = ?";
      db.query(sql, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  }

  static findHistory() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM penarikan_keuntungan WHERE status != 'pending' ORDER BY updated_at DESC";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findByUser(uid) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM penarikan_keuntungan WHERE firebase_uid = ? ORDER BY created_at DESC";
      db.query(sql, [uid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO penarikan_keuntungan (firebase_uid, nama_pengguna, nominal, rekening, metode) VALUES (?, ?, ?, ?, ?)`;
      db.query(sql, [data.firebase_uid, data.nama_pengguna, data.nominal, data.rekening, data.metode], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE penarikan_keuntungan SET status = ? WHERE id = ?";
      db.query(sql, [status, id], err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM penarikan_keuntungan WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = KeuntunganRepository;