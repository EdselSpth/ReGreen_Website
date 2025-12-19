const KeuntunganRepository = require("../repositories/keuntungan.repository");

class KeuntunganService {
  static async getPending() {
    return await KeuntunganRepository.findPending();
  }

  static async getHistory() {
    return await KeuntunganRepository.findHistory();
  }

  static async getByUser(uid) {
    if (!uid) throw new Error("UID wajib diisi");
    return await KeuntunganRepository.findByUser(uid);
  }

  static async create(data) {
    if (!data.firebase_uid || !data.nominal) {
      throw new Error("Data tidak lengkap");
    }

    await KeuntunganRepository.create(data);
  }

  static async updateStatus(id, status) {
    const allowedStatus = ["pending", "diterima", "ditolak"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status tidak valid");
    }

    await KeuntunganRepository.updateStatus(id, status);
  }
}

module.exports = KeuntunganService;
