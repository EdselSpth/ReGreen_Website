const service = require("../services/scheduleService");

exports.index = async (req, res) => {
    try {
        const data = await service.getAllSchedules();
        res.json({ success: true, data });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.store = async (req, res) => {
    try {
        await service.createSchedule(req.body);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Tambahkan ini untuk memproses update
exports.update = async (req, res) => {
    try {
        await service.updateSchedule(req.params.id, req.body);
        res.json({ success: true, message: "Data diperbarui" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        await service.deleteSchedule(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};