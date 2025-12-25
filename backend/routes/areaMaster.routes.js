// routes/areaMaster.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/areaMaster.controller");

// Route untuk meng-approve dan mencatat area
router.post("/register", controller.create); // Fungsi create untuk mencatat area yang disetujui admin
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
