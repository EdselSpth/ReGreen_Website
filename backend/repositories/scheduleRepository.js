const db = require("../config/db");

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jadwal ORDER BY created_at DESC", (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

exports.insert = (data) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO jadwal SET ?", data, (err, res) => {
      if (err) reject(err);
      resolve(res.insertId);
    });
  });
};

exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE jadwal SET ? WHERE id = ?", [data, id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM jadwal WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jadwal WHERE id = ?", [id], (err, res) => {
      if (err) reject(err);
      resolve(res[0]);
    });
  });
};
