const express = require('express');
const router = express.Router();
const adminNoteController = require('../controllers/adminNote.controller');

router.get('/', adminNoteController.getAllNotes);
router.post('/', adminNoteController.createNote);
router.delete('/:id', adminNoteController.deleteNote);

module.exports = router;