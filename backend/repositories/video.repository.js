const db = require("../config/db");

class VideoRepository {
  static findAll(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM video ORDER BY nama_video DESC LIMIT ? OFFSET ?";
      db.query(sql, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static countAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) as total FROM video";
      db.query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0].total);
      });
    });
  }

  static searchEngine(keyword, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nama_video, link_youtube, deskripsi
        FROM video
        WHERE nama_video LIKE ? OR deskripsi LIKE ?
        ORDER BY nama_video ASC
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
      const sql = "SELECT COUNT(*) as total FROM video WHERE nama_video LIKE ?";
      const searchKeyword = `%${keyword}%`;

      db.query(sql, [searchKeyword], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0].total);
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
