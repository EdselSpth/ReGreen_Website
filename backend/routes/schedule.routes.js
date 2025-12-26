const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.index);
router.post('/', scheduleController.store);
router.put('/:id', scheduleController.update); 
router.delete('/:id', scheduleController.destroy);

module.exports = router;