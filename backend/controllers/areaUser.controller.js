const db = require("../config/db");


exports.getAll = (req, res) => {
  const sql = "SELECT * FROM area_user ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Gagal ambil data", error: err });

    res.json(results);
  });
};


exports.getById = (req, res) => {
  const sql = "SELECT * FROM area_user WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Query error", error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "Area tidak ditemukan" });

    res.json(results[0]);
  });
};


exports.create = (req, res) => {
  const { kecamatan, kelurahan, kota, provinsi } = req.body;

  const sql = `
    INSERT INTO area_user (kecamatan, kelurahan, kota, provinsi)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [kecamatan, kelurahan, kota, provinsi], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal daftar area", error: err });

    res.status(201).json({
      message: "Area berhasil didaftarkan",
      id: result.insertId
    });
  });
};


exports.update = (req, res) => {
  const { kecamatan, kelurahan, kota, provinsi } = req.body;

  const sql = `
    UPDATE area_user
    SET kecamatan=?, kelurahan=?, kota=?, provinsi=?
    WHERE id=?
  `;

  db.query(
    sql,
    [kecamatan, kelurahan, kota, provinsi, req.params.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Gagal update", error: err });

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      res.json({ message: "Area berhasil diupdate" });
    }
  );
};

exports.delete = (req, res) => {
  const sql = "DELETE FROM area_user WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal hapus", error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Area berhasil dihapus" });
  });
};
