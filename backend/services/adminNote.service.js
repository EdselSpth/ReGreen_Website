const db = require('../config/db');

class AdminNoteService {
  static async getAll() {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM admin_notes ORDER BY created_at DESC LIMIT 10", (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}
    static async create(data) {
        const { kecamatan, kelurahan } = data;
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO admin_notes (kecamatan, kelurahan) VALUES (?, ?)";
            db.query(sql, [kecamatan, kelurahan], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM admin_notes WHERE id = ?", [id], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }
}

module.exports = AdminNoteService;