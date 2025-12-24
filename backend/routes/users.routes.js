const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');

router.get("/", controller.index);

router.post("/", controller.store);

router.put("/:id", controller.update);

router.delete("/:id", controller.destroy);

router.patch("/:id/password", controller.changePassword);


module.exports = router;