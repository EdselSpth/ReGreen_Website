const db = require("../config/db");

exports.getAll = (req, res) => {
  const sql = `
    SELECT 
      bs.*,
      GROUP_CONCAT(js.nama_jenis SEPARATOR ', ') AS kategori,
      GROUP_CONCAT(js.id) AS kategori_ids
    FROM bank_sampah bs
    LEFT JOIN bank_sampah_jenis_sampah bjs 
      ON bjs.bank_sampah_id = bs.id
    LEFT JOIN jenis_sampah js 
      ON js.id = bjs.jenis_sampah_id
    GROUP BY bs.id
    ORDER BY bs.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("GET ALL ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    res.json(
      rows.map(r => ({
        ...r,
        kategori_ids: r.kategori_ids
          ? r.kategori_ids.split(",").map(Number)
          : []
      }))
    );
  });
};

exports.getById = (req, res) => {
  const sql = "SELECT * FROM bank_sampah WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("GET BY ID ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  console.log("CREATE BODY:", req.body);

  const {
    nama,
    alamat,
    status,
    jam_buka,
    jam_tutup,
    telepon,
    jenis_sampah_ids
  } = req.body;

  // 🔒 VALIDASI STATUS (ENUM CASE-SENSITIVE)
  const validStatus = ["Aktif", "Nonaktif"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      message: "Status tidak valid",
      received: status
    });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error("BEGIN TX ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    const sqlBank = `
      INSERT INTO bank_sampah 
      (nama, alamat, status, jam_buka, jam_tutup, telepon)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sqlBank,
      [nama, alamat, status, jam_buka || null, jam_tutup || null, telepon || null],
      (err, result) => {
        if (err) {
          console.error("INSERT bank_sampah ERROR:", err);
          return db.rollback(() =>
            res.status(500).json({ message: err.message })
          );
        }

        const bankId = result.insertId;

        // kalau tidak ada kategori
        if (!Array.isArray(jenis_sampah_ids) || jenis_sampah_ids.length === 0) {
          return db.commit(() =>
            res.json({ message: "Data berhasil ditambahkan", id: bankId })
          );
        }

        
        const pivot = jenis_sampah_ids
          .filter(id => Number.isInteger(id))
          .map(id => [bankId, id]);

        if (pivot.length === 0) {
          return db.commit(() =>
            res.json({ message: "Data berhasil ditambahkan", id: bankId })
          );
        }

        db.query(
          "INSERT INTO bank_sampah_jenis_sampah (bank_sampah_id, jenis_sampah_id) VALUES ?",
          [pivot],
          err => {
            if (err) {
              console.error("INSERT PIVOT ERROR:", err);
              return db.rollback(() =>
                res.status(500).json({ message: err.message })
              );
            }

            db.commit(() =>
              res.json({ message: "Data berhasil ditambahkan", id: bankId })
            );
          }
        );
      }
    );
  });
};

exports.update = (req, res) => {
  console.log("UPDATE BODY:", req.body);

  const {
    nama,
    alamat,
    status,
    jam_buka,
    jam_tutup,
    telepon,
    jenis_sampah_ids
  } = req.body;

  const bankId = req.params.id;

  const validStatus = ["Aktif", "Nonaktif"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({
      message: "Status tidak valid",
      received: status
    });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error("BEGIN TX ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    const sqlUpdate = `
      UPDATE bank_sampah
      SET nama = ?, alamat = ?, status = ?, jam_buka = ?, jam_tutup = ?, telepon = ?
      WHERE id = ?
    `;

    db.query(
      sqlUpdate,
      [nama, alamat, status, jam_buka || null, jam_tutup || null, telepon || null, bankId],
      err => {
        if (err) {
          console.error("UPDATE bank_sampah ERROR:", err);
          return db.rollback(() =>
            res.status(500).json({ message: err.message })
          );
        }

        db.query(
          "DELETE FROM bank_sampah_jenis_sampah WHERE bank_sampah_id = ?",
          [bankId],
          err => {
            if (err) {
              console.error("DELETE PIVOT ERROR:", err);
              return db.rollback(() =>
                res.status(500).json({ message: err.message })
              );
            }

            if (!Array.isArray(jenis_sampah_ids) || jenis_sampah_ids.length === 0) {
              return db.commit(() =>
                res.json({ message: "Data berhasil diperbarui" })
              );
            }

            const pivot = jenis_sampah_ids
              .filter(id => Number.isInteger(id))
              .map(id => [bankId, id]);

            if (pivot.length === 0) {
              return db.commit(() =>
                res.json({ message: "Data berhasil diperbarui" })
              );
            }

            db.query(
              "INSERT INTO bank_sampah_jenis_sampah (bank_sampah_id, jenis_sampah_id) VALUES ?",
              [pivot],
              err => {
                if (err) {
                  console.error("INSERT PIVOT ERROR:", err);
                  return db.rollback(() =>
                    res.status(500).json({ message: err.message })
                  );
                }

                db.commit(() =>
                  res.json({ message: "Data berhasil diperbarui" })
                );
              }
            );
          }
        );
      }
    );
  });
};

exports.delete = (req, res) => {
  const sql = "DELETE FROM bank_sampah WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Data berhasil dihapus" });
  });
};
