const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS admin_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kecamatan VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("❌ Gagal Membuat Tabel AdminNotes:", err);
  } else {
    console.log("✅ Table AdminNotes siap");
  }
});
