const AdminNoteService = require('../services/adminNote.service');

const getAllNotes = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;
        const result = await AdminNoteService.getAll(page, limit);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createNote = async (req, res) => {
    try {
        await AdminNoteService.create(req.body);
        res.status(201).json({ message: "Berhasil simpan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        await AdminNoteService.delete(req.params.id);
        res.status(200).json({ message: "Berhasil hapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllNotes, createNote, deleteNote };