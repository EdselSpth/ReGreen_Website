const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS artikel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_artikel VARCHAR(150) NOT NULL,
  file_pdf VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Failed create table artikel:", err);
  } else {
    console.log("Table artikel ready");
  }
});
