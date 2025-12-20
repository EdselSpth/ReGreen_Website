const JenisSampahService = require("../services/jenisSampah.service");
const { success, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  try {
    const data = await JenisSampahService.getAll();
    return success(res, 200, data, "List jenis sampah berhasil diambil");
  } catch (err) {
    return error(res, 500, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await JenisSampahService.getById(req.params.id);
    return success(res, 200, data, "Detail jenis sampah berhasil diambil");
  } catch (err) {
    return error(res, 404, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const result = await JenisSampahService.create(req.body);
    return success(
      res,
      201,
      { id: result.insertId },
      "Jenis sampah berhasil ditambahkan"
    );
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    await JenisSampahService.update(req.params.id, req.body);
    return success(res, 200, null, "Jenis sampah berhasil diperbarui");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await JenisSampahService.delete(req.params.id);
    return success(res, 200, null, "Jenis sampah berhasil dihapus");
  } catch (err) {
    return error(res, 400, err.message);
  }
};
