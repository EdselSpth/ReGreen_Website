const db = require("../config/db");

exports.getPending = (req, res) => {
  const sql = "SELECT * FROM penarikan_keuntungan WHERE status = 'pending'";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getHistory = (req, res) => {
  const sql = "SELECT * FROM penarikan_keuntungan WHERE status != 'pending'";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `
    UPDATE penarikan_keuntungan 
    SET status = ? 
    WHERE id = ?
  `;

  db.query(sql, [status, id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status updated" });
  });
};

exports.create = (req, res) => {
  const { firebase_uid, nama_pengguna, nominal } = req.body;

  const sql = `
    INSERT INTO penarikan_keuntungan
    (firebase_uid, nama_pengguna, nominal)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [firebase_uid, nama_pengguna, nominal], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Penarikan berhasil diajukan" });
  });
};

exports.getByUser = (req, res) => {
  const { uid } = req.params;

  const sql = `
    SELECT * FROM penarikan_keuntungan
    WHERE firebase_uid = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [uid], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};


