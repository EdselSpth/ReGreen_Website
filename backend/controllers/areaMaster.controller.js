// controllers/areaMaster.controller.js
const service = require("../services/areaMaster.service");

async function list(req, res, next) {
  try {
    const rows = await service.list();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const row = await service.getById(req.params.id);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

// Fungsi untuk mencatat area yang disetujui admin
async function create(req, res, next) {
  try {
    const payload = req.body || {};
    const row = await service.create(payload); // Pastikan ada nama jalan di payload
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const payload = req.body || {};
    const row = await service.update(req.params.id, payload);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
