const VideoService = require("../services/video.service");
const { success, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const data = await VideoService.getAll(search, page, limit);
    return success(res, 200, data, "List video berhasil diambil");
  } catch (err) {
    return error(res, 500, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await VideoService.getById(req.params.id);
    return success(res, 200, data, "Detail video berhasil diambil");
  } catch (err) {
    return error(res, 404, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const result = await VideoService.create(req.body);
    return success(
      res,
      201,
      { id: result.insertId },
      "Video berhasil ditambahkan"
    );
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    await VideoService.update(req.params.id, req.body);
    return success(res, 200, null, "Video berhasil diperbarui");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await VideoService.delete(req.params.id);
    return success(res, 200, null, "Video berhasil dihapus");
  } catch (err) {
    return error(res, 400, err.message);
  }
};
