const express = require("express");
const router = express.Router();
const controller = require("../controllers/keuntungan.controller");

router.get("/", controller.getPending);
router.post("/", controller.create);
router.get("/user/:uid", controller.getByUser);
router.get("/history", controller.getHistory);
router.put("/:id", controller.updateStatus);
router.delete("/:id", controller.delete);

module.exports = router;
