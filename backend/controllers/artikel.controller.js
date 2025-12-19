const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getAll = (req, res) => {
    const sql = "SELECT * FROM artikel ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch articles");
        }
        return success(res, 200, results, "List artikel berhasil diambil");
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM artikel WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch article");
        }
        if (results.length === 0) {
            return error(res, 404, "Artikel tidak ditemukan");
        }
        return success(res, 200, results[0], "Detail artikel berhasil diambil");
    });
};

exports.create = (req, res) => {
    const { nama_artikel, file_pdf } = req.body;
    if (!nama_artikel || !file_pdf) {
        return error(res, 400, "nama_artikel dan file_pdf wajib diisi");
    }
    const sql = `
        INSERT INTO artikel (nama_artikel, file_pdf)
        VALUES (?, ?)
    `;
    db.query(sql, [nama_artikel, file_pdf], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menambahkan artikel");
        }
        return success(
            res,
            201,
            { id: result.insertId },
            "Artikel berhasil ditambahkan"
        );
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { nama_artikel, file_pdf } = req.body;
    const sql = `
        UPDATE artikel
        SET nama_artikel = ?, file_pdf = ?
        WHERE id = ?
    `;
    db.query(sql, [nama_artikel, file_pdf, id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal memperbarui artikel");
        }
        if (result.affectedRows === 0) {
            return error(res, 404, "Artikel tidak ditemukan");
        }
        return success(res, 200, null, "Artikel berhasil diperbarui");
    });
};

exports.delete = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM artikel WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menghapus artikel");
        }
        if (result.affectedRows === 0) {
            return error(res, 404, "Artikel tidak ditemukan");
        }
        return success(res, 200, null, "Artikel berhasil dihapus");
    });
};