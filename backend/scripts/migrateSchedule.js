const db = require("../config/db");

const sql = `
CREATE TABLE IF NOT EXISTS jadwal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  alamat TEXT NOT NULL,
  courier_name VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  waste_type VARCHAR(255) NOT NULL,
  status ENUM('tersedia','diproses','selesai','ditolak') DEFAULT 'tersedia',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("❌ Gagal membuat tabel jadwal:", err);
  } else {
    console.log("✅ Table jadwal siap");
  }
});
