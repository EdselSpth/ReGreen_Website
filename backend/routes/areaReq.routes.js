// routes/areaReq.routes.js
const router = require("express").Router();
const c = require("../controllers/areaReq.controller");

router.get("/", c.list);
router.put("/:uid", c.update);

module.exports = router;
