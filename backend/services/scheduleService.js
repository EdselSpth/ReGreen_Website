const ScheduleRepository = require("../repositories/scheduleRepository");

const getAllSchedules = async () => {
    return await ScheduleRepository.findAll();
};

const createSchedule = async (data) => {
    return await ScheduleRepository.create(data);
};

const deleteSchedule = async (id) => {
    return await ScheduleRepository.delete(id);
};

// PERBAIKAN: Menambahkan fungsi yang hilang agar tidak crash
const updateSchedule = async (id, data) => {
    return await ScheduleRepository.update(id, data);
};

module.exports = {
    getAllSchedules,
    createSchedule,
    deleteSchedule,
    updateSchedule // Pastikan ini diekspor
};