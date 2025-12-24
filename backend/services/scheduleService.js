const ScheduleRepository = require("../repositories/scheduleRepository");
const { db, admin } = require("../config/firebase");

const validateSchedule = (data) => {
  const required = [
    "alamat",
    "courierName",
    "date",
    "time",
    "userId",
    "wasteType"
  ];

  for (const field of required) {
    if (!data[field]) {
      throw new Error(`${field} wajib diisi`);
    }
  }
};

const createSchedule = async (data) => {
  validateSchedule(data);

  // Cek konflik di MySQL
  const conflict = await ScheduleRepository.findConflict(
    data.courierName,
    data.date,
    data.time
  );

  if (conflict.length > 0) {
    throw new Error("Jadwal bentrok");
  }

  data.status = "terdaftar";

  // SIMPAN KE MYSQL
  await ScheduleRepository.create(data);

  // SIMPAN KE FIREBASE
  await db.collection("penjemputan").add({
    alamat: data.alamat,
    courierName: data.courierName,
    date: data.date,
    time: data.time,
    wasteType: data.wasteType,
    status: data.status,
    userId: data.userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return true;
};

module.exports = {
  createSchedule
};
