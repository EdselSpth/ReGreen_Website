const db = require("../config/db");

//get untuk pagination + serach
exports.getPaginated = ({ page, limit, search }) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let where = "";
    let params = [];

    if (search) {
      where = `
        WHERE courier_name LIKE ?
        OR alamat LIKE ?
      `;
      params.push(`%${search}%`, `%${search}%`);
    }

    const dataSql = `
      SELECT *
      FROM jadwal
      ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM jadwal
      ${where}
    `;

    db.query(countSql, params, (err, countRes) => {
      if (err) return reject(err);

      const total = countRes[0].total;

      db.query(
        dataSql,
        [...params, Number(limit), Number(offset)],
        (err, rows) => {
          if (err) return reject(err);

          resolve({
            data: rows,
            total,
          });
        }
      );
    });
  });
};

exports.insert = (data) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO jadwal SET ?", data, (err, result) => {
      if (err) return reject(err);
      resolve(result?.insertId || null);
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
