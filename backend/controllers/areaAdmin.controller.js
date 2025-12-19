const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = "SELECT * FROM area_user ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal ambil data area",
        error: err
      });
    }
    res.json(results);
  });
};

exports.getById = (req, res) => {
  const sql = "SELECT * FROM area_user WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Query error",
        error: err
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json(results[0]);
  });
};

exports.update = (req, res) => {
  const { status } = req.body;

  const sql = `
    UPDATE area_user
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal update status area",
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Status area berhasil diperbarui" });
  });
};

exports.delete = (req, res) => {
  const sql = "DELETE FROM area_user WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal hapus area",
        error: err
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Area berhasil dihapus" });
  });
};
