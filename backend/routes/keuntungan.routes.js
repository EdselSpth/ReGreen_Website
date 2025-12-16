const express = require("express");
const router = express.Router();
const controller = require("../controllers/keuntungan.controller");

router.get("/", controller.getAll);

module.exports = router;
