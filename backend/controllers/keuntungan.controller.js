const KeuntunganService = require("../services/keuntungan.service");
const { db } = require("../config/firebase");
const { success, error } = require("../utils/response");

exports.getPending = async (req, res) => {
  try {
    const data = await KeuntunganService.getPending();
    
    // Ambil saldo realtime dari firestore untuk setiap baris
    const enrichedData = await Promise.all(data.map(async (item) => {
        const userDoc = await db.collection('users').doc(item.firebase_uid).get();
        return {
            ...item,
            saldo_user: userDoc.exists ? (userDoc.data().balance || 0) : 0
        };
    }));

    success(res, 200, enrichedData);
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
    // Ambil page dan limit dari query string, berikan default jika kosong
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const data = await KeuntunganService.getByUser(req.params.uid, page, limit);
    
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
    success(res, 200, null, `Status diperbarui menjadi ${req.body.status}`);
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