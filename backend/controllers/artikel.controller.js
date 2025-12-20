const ArtikelService = require("../services/artikel.service");
const { success, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  try {
    const data = await ArtikelService.getAll();
    return success(res, 200, data, "List artikel berhasil diambil");
  } catch (err) {
    return error(res, 500, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ArtikelService.getById(req.params.id);
    return success(res, 200, data, "Detail artikel berhasil diambil");
  } catch (err) {
    return error(res, 404, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const result = await ArtikelService.create(req.body);
    return success(
      res,
      201,
      { id: result.insertId },
      "Artikel berhasil ditambahkan"
    );
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    await ArtikelService.update(req.params.id, req.body);
    return success(res, 200, null, "Artikel berhasil diperbarui");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await ArtikelService.delete(req.params.id);
    return success(res, 200, null, "Artikel berhasil dihapus");
  } catch (err) {
    return error(res, 400, err.message);
  }
};
