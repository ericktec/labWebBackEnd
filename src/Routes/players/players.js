const express = require("express");
const router = express.Router();

const controller = require("./playersController");
router.get("/getPlayers", controller.getPlayers);
router.post("/newPlayer", controller.newPlayer);

module.exports = router;