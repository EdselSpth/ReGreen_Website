const db = require("../config/db");

const queries = [
  // Di scripts/migrasi lu, pastikan strukturnya lengkap:
`CREATE TABLE IF NOT EXISTS bank_sampah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  status ENUM('Aktif', 'Nonaktif') NOT NULL,
  jam_buka TIME NULL,
  jam_tutup TIME NULL,
  telepon VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `
  CREATE TABLE IF NOT EXISTS bank_sampah_jenis_sampah (
    bank_sampah_id INT NOT NULL,
    jenis_sampah_id INT NOT NULL,
    PRIMARY KEY (bank_sampah_id, jenis_sampah_id),
    FOREIGN KEY (bank_sampah_id) REFERENCES bank_sampah(id) ON DELETE CASCADE,
    FOREIGN KEY (jenis_sampah_id) REFERENCES jenis_sampah(id) ON DELETE CASCADE
  )`
];

(async () => {
  try {
    for (const sql of queries) {
      await new Promise((resolve, reject) => {
        db.query(sql, err => err ? reject(err) : resolve());
      });
    }
    console.log("✅ Migration bank_sampah berhasil");
  } catch (err) {
    console.error("❌ Migration bank_sampah gagal:", err.message);
  }
})();
