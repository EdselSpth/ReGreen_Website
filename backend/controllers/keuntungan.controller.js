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
  const {
    firebase_uid,
    nama_pengguna,
    nominal,
    rekening,
    metode
  } = req.body;

  const sql = `
    INSERT INTO penarikan_keuntungan
    (firebase_uid, nama_pengguna, nominal, rekening, metode)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [firebase_uid, nama_pengguna, nominal, rekening, metode],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Penarikan berhasil diajukan" });
    }
  );
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

// const KeuntunganService = require("../services/keuntungan.service");
// const { success, error } = require("../utils/response");

// exports.getPending = async (req, res) => {
//   try {
//     const data = await KeuntunganService.getPending();
//     success(res, 200, data);
//   } catch (err) {
//     error(res, 500, err.message);
//   }
// };

// exports.getHistory = async (req, res) => {
//   try {
//     const data = await KeuntunganService.getHistory();
//     success(res, 200, data);
//   } catch (err) {
//     error(res, 500, err.message);
//   }
// };

// exports.getByUser = async (req, res) => {
//   try {
//     const data = await KeuntunganService.getByUser(req.params.uid);
//     success(res, 200, data);
//   } catch (err) {
//     error(res, 400, err.message);
//   }
// };

// exports.create = async (req, res) => {
//   try {
//     await KeuntunganService.create(req.body);
//     success(res, 201, null, "Penarikan berhasil diajukan");
//   } catch (err) {
//     error(res, 400, err.message);
//   }
// };

// exports.updateStatus = async (req, res) => {
//   try {
//     await KeuntunganService.updateStatus(req.params.id, req.body.status);
//     success(res, 200, null, "Status updated");
//   } catch (err) {
//     error(res, 400, err.message);
//   }
// };
