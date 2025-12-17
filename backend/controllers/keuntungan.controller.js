const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = "SELECT * FROM keuntungan WHERE status = 'pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

exports.getHistory = (req, res) => {
  const sql = "SELECT * FROM keuntungan WHERE status != 'pending'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
