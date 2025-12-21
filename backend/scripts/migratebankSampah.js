const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS bank_sampah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  jenis VARCHAR(100) NOT NULL,
  status ENUM('Aktif', 'Nonaktif') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("❌ Gagal Membuat Tabel bank_sampah:", err);
  } else {
    console.log("✅ Table bank_sampah siap");
  }
});
