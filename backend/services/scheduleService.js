const mysqlRepo = require("../repositories/scheduleRepository");
const firebaseRepo = require("../repositories/scheduleFirebase.repository");


function mapMysqlToFirebase(data) {
  return {
    alamat: data.alamat,
    courier_name: data.courier_name || "",
    date: data.date,
    time: data.time,
    waste_type: data.waste_type || "campuran",
    status: data.status || "tersedia",
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
  if (!data.waste_type) data.waste_type = "campuran";

  const mysqlId = await mysqlRepo.insert(data);

  const firebaseDocId = await firebaseRepo.create(
    mapMysqlToFirebase(data)
  );

  await mysqlRepo.update(mysqlId, { firebase_doc_id: firebaseDocId });
};



exports.updateSchedule = async (id, data) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  const merged = { ...existing, ...data };

  await mysqlRepo.update(id, merged);

  if (existing.firebase_doc_id) {
    await firebaseRepo.update(
      existing.firebase_doc_id,
      mapMysqlToFirebase(merged)
    );
  }
};



exports.deleteSchedule = async (id) => {
  const existing = await mysqlRepo.findById(id);
  if (!existing) throw new Error("Data tidak ditemukan");

  await mysqlRepo.delete(id);
  await firebaseRepo.delete(existing.firebase_doc_id);
};
