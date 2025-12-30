const KeuntunganRepository = require("../repositories/keuntungan.repository");
const { db, admin } = require("../config/firebase");

class KeuntunganService {
  static async getPending() {
    return await KeuntunganRepository.findPending();
  }

  static async getHistory() {
    return await KeuntunganRepository.findHistory();
  }

  static async getByUser(uid, page = 1, limit = 10) {
    if (!uid) throw new Error("UID wajib diisi");
    
    const offset = (page - 1) * limit; 
    return await KeuntunganRepository.findByUser(uid, limit, offset);
  }

  static async create(data) {
    if (!data.firebase_uid || !data.nominal) throw new Error("Data tidak lengkap");
    await KeuntunganRepository.create(data);
  }

  static async updateStatus(id, status, alasan = null) {
    const allowedStatus = ["pending", "diterima", "ditolak"];
    if (!allowedStatus.includes(status)) throw new Error("Status tidak valid");

    // 1. Ambil data penarikan dari MySQL
    const penarikan = await KeuntunganRepository.findById(id);
    if (!penarikan) throw new Error("Data penarikan tidak ditemukan");

    // 2. Jika status DITERIMA dan bukan Admin, potong saldo Firestore
    if (status === "diterima" && !penarikan.firebase_uid.includes("ADMIN")) {
      
      const userRef = db.collection('users').doc(penarikan.firebase_uid);
      
      await db.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("User tidak ditemukan di Firestore");

        const currentBalance = doc.data().balance || 0;
        const nominalTarik = Number(penarikan.nominal);

        if (currentBalance < nominalTarik) {
          throw new Error("Saldo user tidak mencukupi di Firestore");
        }

        const newBalance = currentBalance - nominalTarik;

        // Update Saldo User
        t.update(userRef, { 
          balance: newBalance,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Catat History Transaksi di Firestore
        const transRef = db.collection('transactions').doc();
        t.set(transRef, {
          userId: penarikan.firebase_uid,
          type: 'WITHDRAW',
          amount: nominalTarik,
          previousBalance: currentBalance,
          finalBalance: newBalance,
          description: `Penarikan Keuntungan Ke ${penarikan.metode}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
    } 

    // 3. Simpan status dan alasan ke database MySQL
    // Kita mengirimkan parameter 'alasan' (bisa null jika diterima)
    await KeuntunganRepository.updateStatus(id, status, alasan);
  }

  static async delete(id) {
    return await KeuntunganRepository.delete(id);
  }
}

module.exports = KeuntunganService;