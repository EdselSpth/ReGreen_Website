const service = require("../services/scheduleService");

exports.store = async (req, res) => {
  try {
    await service.createSchedule(req.body);
    res.status(201).json({
      message: "Jadwal berhasil disimpan ke MySQL dan Firebase"
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};
