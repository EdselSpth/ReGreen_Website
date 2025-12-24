const UsersService = require("../services/users.service");

const { success, error } = require("../utils/response");

exports.index = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const userData = await UsersService.getUsers(search, page, limit);
    return success(res, 200, userData, "Data users berhasil diambil");
  } catch (err) {
    return error(res, 500, err.message);
  }
};

exports.store = async (req, res) => {
  try {
    await UsersService.createUser(req.body);
    return success(res, 201, null, "User berhasil ditambahkan");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    await UsersService.update(req.params.id, req.body);
    return success(res, 200, null, "User berhasil diupdate");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.destroy = async (req, res) => {
  try {
    await UsersService.delete(req.params.id);
    return success(res, 200, null, "User berhasil dihapus");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    await UsersService.updatePassword(req.params.id, req.body.password);
    return success(res, 200, null, "Password berhasil diubah");
  } catch (err) {
    return error(res, 500, err.message);
  }
};
