const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(128) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('Admin', 'Kurir') DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("❌ Gagal Membuat Tabel users:", err);
  } else {
    console.log("✅ Table users siap");
  }
});
