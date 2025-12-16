const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/dataBankSampah.json");

exports.getAll = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
};

exports.getById = (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const item = data.find((entry) => entry.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
};

exports.create = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let maxId = 0;
  for (const entry of data) {
    const n = parseInt(entry.id, 10);
    if (!Number.isNaN(n) && n > maxId) {
      maxId = n;
    }
  }
  const nextId = (maxId + 1).toString();

  const newItem = {
    id: nextId,
    ...req.body
  };

  data.push(newItem);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newItem);
};


exports.update = (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = data.findIndex((entry) => entry.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedItem };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json(data[index]);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = data.findIndex((entry) => entry.id === id);
    if (index !== -1) {
        const deletedItem = data.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json(deletedItem[0]);
    } else {
        res.status(404).json({ message: "Item not found" });
    } 
};