const mysqlRepo = require("../repositories/scheduleRepository");
const firebaseRepo = require("../repositories/scheduleFirebase.repository");


function mapMysqlToFirebase(mysql) {
  return {
    alamat: mysql.alamat,
    courierName: mysql.courier_name || "",
    date: mysql.date,
    time: mysql.time,
    wasterType: mysql.waste_type || "campuran",
    status: mysql.status || "tersedia",
  };
}

//get all untuk mendukung fungsi pagination dan search
exports.getAllSchedules = async ({ page, limit, search }) => {
  const result = await mysqlRepo.getPaginated({
    page,
    limit,
    search,
  });

  return {
    data: result.data,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPage: Math.ceil(result.total / limit),
    },
  };
};


exports.createSchedule = async (data) => {
  if (!data.waste_type) {
    data.waste_type = "campuran";
  }

  const firebaseData = mapMysqlToFirebase(data);
  const firebaseDocId = await firebaseRepo.create(firebaseData);

  await mysqlRepo.insert({
    ...data,
    firebase_doc_id: firebaseDocId,
  });
};


exports.updateSchedule = async (id, data) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  if (!data.waste_type) {
    data.waste_type = existing.waste_type || "campuran";
  }

  await mysqlRepo.update(id, data);

  await firebaseRepo.update(
    existing.firebase_doc_id,
    mapMysqlToFirebase({ ...existing, ...data })
  );
};


exports.deleteSchedule = async (id) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  await mysqlRepo.delete(id);
  await firebaseRepo.delete(existing.firebase_doc_id);
};
