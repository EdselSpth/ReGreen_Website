const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/dataKeuntungan.json");

exports.getAll = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
};
