const express = require("express");
const router = express.Router();

const controller = require("./testController");

router.get("/test", controller.test);

module.exports = router;