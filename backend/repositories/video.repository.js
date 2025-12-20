const db = require("../config/db");

class VideoRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM video ORDER BY created_at DESC";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM video WHERE id = ?";
      db.query(sql, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO video (nama_video, link_youtube, deskripsi)
        VALUES (?, ?, ?)
      `;
      db.query(
        sql,
        [data.nama_video, data.link_youtube, data.deskripsi],
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
        UPDATE video
        SET nama_video = ?, link_youtube = ?, deskripsi = ?
        WHERE id = ?
      `;
      db.query(
        sql,
        [data.nama_video, data.link_youtube, data.deskripsi, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM video WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = VideoRepository;
