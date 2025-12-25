const express = require("express");
const router = express.Router();
const controller = require("../controllers/areaUser.controller");

router.post('/pendaftaran-area', controller.createArea);

module.exports = router;
