const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS video (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_video VARCHAR(150) NOT NULL,
  link_youtube VARCHAR(255) NOT NULL,
  deskripsi TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Failed create table video:", err);
  } else {
    console.log("Table video ready");
  }
});
