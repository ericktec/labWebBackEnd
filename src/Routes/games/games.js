const express = require("express");
const router = express.Router();

const controller = require("./gamesController");

router.get("/test", controller.test);
router.post("/registerGame", controller.registerGame);

module.exports = router;