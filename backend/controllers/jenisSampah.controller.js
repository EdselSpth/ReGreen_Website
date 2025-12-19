const db = require("../config/db");
const {sucess, error} = require("../utils/response");

exports.getAll = (req, res) => {
    const sql = "SELECT * FROM jenis_sampah ORDER BY nama_sampah ASC";
    db.query(sql, (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch jenis sampah");
        }
        return sucess(res, 200, results, "List jenis sampah berhasil diambil");
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM jenis_sampah WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch jenis sampah");
        }

        if (results.length === 0) {
            return error(res, 404, "Jenis sampah tidak ditemukan");
        }
        return sucess(res, 200, results[0], "Detail jenis sampah berhasil diambil");
    });
};

exports.create = (req, res) => {
   const { nama_jenis, harga_per_kg } = req.body;
    if (!nama_jenis || !harga_per_kg) {
        return error(res, 400, "nama_jenis dan harga_per_kg wajib diisi");
    }
    const sql = `
        INSERT INTO jenis_sampah (nama_jenis, harga_per_kg)
        VALUES (?, ?)
    `;
    db.query(sql, [nama_jenis, harga_per_kg], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menambahkan jenis sampah");
        }
        return sucess(
            res,
            201,
            { id: result.insertId },
            "Jenis sampah berhasil ditambahkan"
        );
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { nama_jenis, harga_per_kg } = req.body;
    const sql = `
        UPDATE jenis_sampah
        SET nama_jenis = ?, harga_per_kg = ?    
        WHERE id = ?
    `;
    db.query(sql, [nama_jenis, harga_per_kg, id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal memperbarui jenis sampah");
        }
        return sucess(
            res,
            200,
            { affectedRows: result.affectedRows },
            "Jenis sampah berhasil diperbarui"
        );
    });
}

exports.delete = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM jenis_sampah WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menghapus jenis sampah");
        }
        return sucess(
            res,
            200,
            { affectedRows: result.affectedRows },
            "Jenis sampah berhasil dihapus"
        );
    });
};