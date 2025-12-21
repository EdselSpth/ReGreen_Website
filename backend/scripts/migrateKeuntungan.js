const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS penarikan_keuntungan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128),
  nama_pengguna VARCHAR(100),
  nominal INT,
  rekening VARCHAR(50) NULL,
  metode VARCHAR(50) NULL,
  status ENUM('pending','diterima','ditolak') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("❌ Gagal Membuat Tabel penarikan_keuntungan:", err);
  } else {
    console.log("✅ Table penarikan_keuntungan siap");
  }
});
