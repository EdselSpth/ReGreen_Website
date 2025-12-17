const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const dataPath = path.join(__dirname, "../data/dataKeuntungan.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

data.forEach(item => {
  const sql = `
    INSERT INTO keuntungan (nama, nominal, rekening, metode)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [item.nama, item.nominal, item.rekening, item.metode],
    err => {
      if (err) console.error(err);
    }
  );
});

console.log("Migrasi data keuntungan selesai");
