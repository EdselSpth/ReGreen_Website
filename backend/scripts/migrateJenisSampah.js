const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS jenis_sampah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jenis VARCHAR(100) NOT NULL,
    harga_per_kg INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error("❌ Gagal Membuat Tabel jenis_sampah:", err);
    } else {
        console.log("✅ Table jenis_sampah siap");
    }
});