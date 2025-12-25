const db = require("../config/db");

class ScheduleRepository {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM jadwal ORDER BY id DESC", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO jadwal 
                (firebase_uid, alamat, courier_name, date, time, waste_type, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            // Sinkronisasi: Menggunakan nama field yang dikirim dari fetch JS
            db.query(sql, [
                data.firebase_uid || "ADMIN-MANUAL", 
                data.alamat, 
                data.courier_name, 
                data.date, 
                data.time, 
                data.waste_type || "Umum", 
                data.status || 'tersedia'
            ], (err, result) => {
                if (err) reject(err);
                else resolve(result.insertId);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE jadwal SET 
                alamat = ?, 
                courier_name = ?, 
                date = ?, 
                time = ?, 
                waste_type = ?, 
                status = ? 
                WHERE id = ?
            `;
            db.query(sql, [
                data.alamat, 
                data.courier_name, 
                data.date, 
                data.time, 
                data.waste_type || "Umum", 
                data.status || 'tersedia', 
                id
            ], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM jadwal WHERE id = ?", [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = ScheduleRepository;