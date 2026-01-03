const db = require('../config/db');

class AdminNoteService {
static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM admin_notes ORDER BY created_at DESC LIMIT ? OFFSET ?";
        db.query(sql, [limit, offset], (err, res) => {
            if (err) return reject(err);
            db.query("SELECT COUNT(*) as total FROM admin_notes", (errCount, resCount) => {
                if (errCount) return reject(errCount);
                const totalData = resCount[0].total;
                const totalPages = Math.ceil(totalData / limit);
                
                resolve({
                    data: res,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: totalPages,
                        totalData: totalData
                    }
                });
            });
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