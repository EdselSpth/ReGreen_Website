// scripts/migrateAreaMaster.js
const db = require('../config/db');  // Pastikan path ke file db.js sudah benar

// Query untuk membuat tabel dengan kolom tambahan 'jalan'
const sql = `
  CREATE TABLE IF NOT EXISTS area_terdaftar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kecamatan VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    kota VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    jalan VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Jalankan migrasi
db.query(sql, (err) => {
  if (err) {
    console.error("❌ migrate area_terdaftar failed:", err.message);
  } else {
    console.log("✅ migrate area_terdaftar done");
  }
});
