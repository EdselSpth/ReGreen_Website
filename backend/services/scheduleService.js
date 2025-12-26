const mysqlRepo = require("../repositories/scheduleRepository");
const firebaseRepo = require("../repositories/scheduleFirebase.repository");

/**
 * Mapping MySQL → Firebase
 * ❗ TIDAK BOLEH ADA undefined
 */
function mapMysqlToFirebase(mysql) {
  return {
    alamat: mysql.alamat || "",
    courierName: mysql.courier_name || "",
    date: mysql.date || "",
    time: mysql.time || "",
    wasterType: mysql.waste_type || "",
    status: mysql.status || "tersedia",
  };
}

/**
 * GET ALL
 */
exports.getAllSchedules = async () => {
  return await mysqlRepo.getAll();
};

/**
 * CREATE
 */
exports.createSchedule = async (data) => {
  // 🔒 VALIDASI
  if (!data.courier_name || !data.alamat || !data.date || !data.time) {
    throw new Error("Data tidak lengkap");
  }

  const payload = {
    firebase_uid: data.firebase_uid || "ADMIN_MANUAL",
    courier_name: data.courier_name,
    alamat: data.alamat,
    date: data.date,
    time: data.time,
    waste_type: data.waste_type || "campuran",
    status: data.status || "tersedia",
  };

  // 👉 Firebase
  const firebaseDocId = await firebaseRepo.create(
    mapMysqlToFirebase(payload)
  );

  // 👉 MySQL
  await mysqlRepo.insert({
    ...payload,
    firebase_doc_id: firebaseDocId,
  });
};

/**
 * UPDATE
 */
exports.updateSchedule = async (id, data) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  // 🔒 JANGAN overwrite kolom NOT NULL
  const updateData = {
    courier_name: data.courier_name ?? existing.courier_name,
    alamat: data.alamat ?? existing.alamat,
    date: data.date ?? existing.date,
    time: data.time ?? existing.time,
    waste_type: data.waste_type ?? existing.waste_type,
    status: data.status ?? existing.status,

    // ❗ PENTING
    firebase_uid: existing.firebase_uid,
  };

  await mysqlRepo.update(id, updateData);

  await firebaseRepo.update(
    existing.firebase_doc_id,
    mapMysqlToFirebase({ ...existing, ...updateData })
  );
};

/**
 * DELETE
 */
exports.deleteSchedule = async (id) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  await mysqlRepo.delete(id);
  await firebaseRepo.delete(existing.firebase_doc_id);
};
