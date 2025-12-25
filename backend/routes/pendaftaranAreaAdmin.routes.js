const express = require('express');
const router = express.Router();
const controller = require('../controllers/areaAdmin.controller');

// GET semua area
router.get('/', controller.getAllAreas);

// GET area dengan status pending
router.get('/pending', controller.getPendingAreas);

// APPROVE area
router.put('/approve/:areaId', controller.approveArea);

// REJECT area
router.put('/reject/:areaId', controller.rejectArea);

// DELETE area
router.delete('/:areaId', controller.deleteArea);

module.exports = router;
