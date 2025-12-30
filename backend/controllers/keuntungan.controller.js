const KeuntunganService = require("../services/keuntungan.service");
const { db } = require("../config/firebase");
const { success, error } = require("../utils/response");
const ExcelJS = require('exceljs');

exports.getPending = async (req, res) => {
  try {
    const data = await KeuntunganService.getPending();

    if (!data || data.length === 0) {
      return success(res, 200, []);
    }
    
    const enrichedData = await Promise.all(data.map(async (item) => {
        try {
            if (!item.firebase_uid) {
                console.warn(`[WARNING] Data ID ${item.id} tidak punya firebase_uid.`);
                return { ...item, saldo_user: 0 };
            }

            const userDoc = await db.collection('users').doc(item.firebase_uid).get();
            
            return {
                ...item,
                saldo_user: userDoc.exists ? (userDoc.data().balance || 0) : 0
            };

        } catch (firebaseError) {
            console.error(`[ERROR FIREBASE] Gagal ambil saldo untuk UID ${item.firebase_uid}:`, firebaseError.message);
            return { ...item, saldo_user: 0 }; 
        }
    }));

    success(res, 200, enrichedData);

  } catch (err) {
    console.error("[CRITICAL ERROR] getPending:", err);
    error(res, 500, "Terjadi kesalahan pada server: " + err.message);
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
    const { status, alasan } = req.body; // Mengambil status dan alasan (optional) dari body
    await KeuntunganService.updateStatus(req.params.id, status, alasan);
    success(res, 200, null, `Status diperbarui menjadi ${status}`);
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

exports.exportExcel = async (req, res) => {
    try {
      const data = await KeuntunganService.getHistory();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Riwayat Penarikan');
  
      // Definisi Kolom Excel
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nama Pengguna', key: 'nama_pengguna', width: 25 },
        { header: 'Nominal', key: 'nominal', width: 15 },
        { header: 'Metode', key: 'metode', width: 15 },
        { header: 'No Rekening', key: 'rekening', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Alasan Penolakan', key: 'alasan_tolak', width: 30 },
        { header: 'Tanggal Pengajuan', key: 'created_at', width: 20 },
        { header: 'Update Terakhir', key: 'updated_at', width: 20 }
      ];
  
      // Tambah Data ke Baris
      data.forEach(item => {
        worksheet.addRow({
            ...item,
            created_at: item.created_at.toLocaleString('id-ID'),
            updated_at: item.updated_at.toLocaleString('id-ID')
        });
      });
  
      // Styling Header agar Tebal
      worksheet.getRow(1).font = { bold: true };
  
      // Set Header Respon untuk Download File
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Riwayat_Penarikan_Regreen.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error("[ERROR EXPORT]", err);
      error(res, 500, "Gagal mengexport data ke Excel");
    }
};