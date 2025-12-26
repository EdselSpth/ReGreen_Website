const express = require('express');
const router = express.Router();
const areaReqController = require('../controllers/areaReq.controller');

router.get('/', areaReqController.list);
router.put("/:uid", areaReqController.update);

module.exports = router;
