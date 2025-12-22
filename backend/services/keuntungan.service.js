const KeuntunganRepository = require("../repositories/keuntungan.repository");
const { db, admin } = require("../config/firebase");

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
    if (!data.firebase_uid || !data.nominal) throw new Error("Data tidak lengkap");
    await KeuntunganRepository.create(data);
  }

static async updateStatus(id, status) {
    const allowedStatus = ["pending", "diterima", "ditolak"];
    if (!allowedStatus.includes(status)) throw new Error("Status tidak valid");

    // 1. Ambil data penarikan dari MySQL terlebih dahulu
    const penarikan = await KeuntunganRepository.findById(id);
    if (!penarikan) throw new Error("Data penarikan tidak ditemukan");

    // 2. CEK: Apakah ini data Admin atau data User asli?
    // Jika statusnya 'diterima' DAN firebase_uid TIDAK mengandung kata 'ADMIN'
    if (status === "diterima" && !penarikan.firebase_uid.includes("ADMIN")) {
      
      const userRef = db.collection('users').doc(penarikan.firebase_uid);
      
      await db.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("User tidak ditemukan di Firestore");

        const currentBalance = doc.data().balance || 0;
        const nominalTarik = Number(penarikan.nominal);

        if (currentBalance < nominalTarik) {
          throw new Error("Saldo user tidak mencukupi");
        }

        const newBalance = currentBalance - nominalTarik;

        // Potong saldo di Firestore
        t.update(userRef, { 
          balance: newBalance,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Simpan history transaksi di Firestore
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
    // Jika firebase_uid mengandung kata 'ADMIN', blok kode di atas akan dilewati (skip).

    // 3. Apapun jenis datanya (Admin/User), status di MySQL tetap harus diupdate
    await KeuntunganRepository.updateStatus(id, status);
  }

  static async delete(id) {
    return await KeuntunganRepository.delete(id);
  }
}

module.exports = KeuntunganService;