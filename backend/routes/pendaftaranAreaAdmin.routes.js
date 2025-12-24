const express = require('express');
const router = express.Router();
const controller = require('../controllers/areaAdmin.controller');


router.get('/', controller.getAllAreas);
router.get('/pending', controller.getPendingAreas);
router.put('/approve/:areaId', controller.approveArea);
router.put('/reject/:areaId', controller.rejectArea);
router.delete('/:areaId', controller.deleteArea);

module.exports = router;
