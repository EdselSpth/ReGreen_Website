const db = require("../config/db");

const sql = `
CREATE TABLE IF NOT EXISTS area_user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  kelurahan VARCHAR(100) NOT NULL,
  kota VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(sql, err => {
  if (err) {
    console.error("❌ Gagal migrate area_user:", err);
  } else {
    console.log("✅ Table area_user ready");
  }
});
