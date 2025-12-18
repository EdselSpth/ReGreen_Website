const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getAll = (req, res) => {
    const sql = "SELECT * FROM video ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch videos");
        }

        return success(res, 200, results, "List video berhasil diambil");
    });
};

exports.getById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM video WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return error(res, 500, "Failed to fetch video");
        }

        if (results.length === 0) {
            return error(res, 404, "Video tidak ditemukan");
        }

        return success(res, 200, results[0], "Detail video berhasil diambil");
    });
};

exports.create = (req, res) => {
    const { nama_video, link_youtube, deskripsi } = req.body;

    if (!nama_video || !link_youtube) {
        return error(res, 400, "nama_video dan link_youtube wajib diisi");
    }

    const sql = `
        INSERT INTO video (nama_video, link_youtube, deskripsi)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nama_video, link_youtube, deskripsi], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menambahkan video");
        }

        return success(
            res,
            201,
            { id: result.insertId },
            "Video berhasil ditambahkan"
        );
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { nama_video, link_youtube, deskripsi } = req.body;

    const sql = `
        UPDATE video
        SET nama_video = ?, link_youtube = ?, deskripsi = ?
        WHERE id = ?
    `;

    db.query(sql, [nama_video, link_youtube, deskripsi, id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal memperbarui video");
        }

        if (result.affectedRows === 0) {
            return error(res, 404, "Video tidak ditemukan");
        }

        return success(res, 200, null, "Video berhasil diperbarui");
    });
};

exports.delete = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM video WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return error(res, 500, "Gagal menghapus video");
        }

        if (result.affectedRows === 0) {
            return error(res, 404, "Video tidak ditemukan");
        }

        return success(res, 200, null, "Video berhasil dihapus");
    });
};
