const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = "SELECT * FROM bank_sampah ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal ambil data", error: err });
    }
    res.json(results);
  });
};

exports.getById = (req, res) => {
  const sql = "SELECT * FROM bank_sampah WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Query error", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  const { nama, alamat, jenis, status } = req.body;

  const sql = `
    INSERT INTO bank_sampah (nama, alamat, jenis, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nama, alamat, jenis, status], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal tambah data", error: err });
    }

    res.status(201).json({
      id: result.insertId,
      nama,
      alamat,
      jenis,
      status
    });
  });
};

exports.update = (req, res) => {
  const { nama, alamat, jenis, status } = req.body;

  const sql = `
    UPDATE bank_sampah
    SET nama = ?, alamat = ?, jenis = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [nama, alamat, jenis, status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal update data", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data berhasil diupdate" });
    }
  );
};

exports.delete = (req, res) => {
  const sql = "DELETE FROM bank_sampah WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal hapus data", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Data berhasil dihapus" });
  });
};
