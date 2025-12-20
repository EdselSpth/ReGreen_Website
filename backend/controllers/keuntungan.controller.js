const KeuntunganService = require("../services/keuntungan.service");
const { success, error } = require("../utils/response");

exports.getPending = async (req, res) => {
  try {
    const data = await KeuntunganService.getPending();
    success(res, 200, data);
  } catch (err) {
    error(res, 500, err.message);
  }
};

exports.getHistory = async (req, res) => {
  try {
    const data = await KeuntunganService.getHistory();
    success(res, 200, data);
  } catch (err) {
    error(res, 500, err.message);
  }
};

exports.getByUser = async (req, res) => {
  try {
    const data = await KeuntunganService.getByUser(req.params.uid);
    success(res, 200, data);
  } catch (err) {
    error(res, 400, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    await KeuntunganService.create(req.body);
    success(res, 201, null, "Penarikan berhasil diajukan");
  } catch (err) {
    error(res, 400, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await KeuntunganService.updateStatus(req.params.id, req.body.status);
    success(res, 200, null, "Status updated");
  } catch (err) {
    error(res, 400, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await KeuntunganService.delete(req.params.id);
    success(res, 200, null, "Data berhasil dihapus");
  } catch (err) {
    error(res, 400, err.message);
  }
};

