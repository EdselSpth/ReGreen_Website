const db = require("../config/db");

class ScheduleRepository {


    static findAll(limit, offset) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM jadwal
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            db.query(sql, [limit, offset], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }


    static countAll() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) AS total FROM jadwal";
            db.query(sql, (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0].total);
            });
        });
    }


    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM jadwal
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;
            db.query(sql, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }


    static findConflict(courierName, date, time) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id
                FROM jadwal
                WHERE courier_name = ?
                  AND date = ?
                  AND time = ?
            `;
            db.query(sql, [courierName, date, time], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const sql = `
            INSERT INTO jadwal
            (firebase_uid, alamat, courier_name, date, time, status, waste_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
            db.query(sql, [
                data.userId, // ini firebase UID
                data.alamat,
                data.courierName,
                data.date,
                data.time,
                data.status,
                data.wasteType
            ], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }



    static updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE jadwal
                SET status = ?
                WHERE id = ?
            `;
            db.query(sql, [status, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }


    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM jadwal WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = ScheduleRepository;
