const db = require("../config/db");

const sql = `
CREATE TABLE IF NOT EXISTS pendaftaran_area (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  kelurahan VARCHAR(100) NOT NULL,
  kota VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("❌ Gagal Membuat Tabel pendaftaran_area:", err);
  } else {
    console.log("✅ Table pendaftaran_area siap");
  }
});
