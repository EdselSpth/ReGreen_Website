const express = require("express");
const router = express.Router();
const controller = require("../controllers/areaUser.controller");

router.post('/pendaftaran-area', areaUserController.createArea);

module.exports = router;
