const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../../Middleware/auth");

const controller = require("./playersController");
router.get("/getPlayers", controller.getPlayers);
router.get("/getPlayersNonSubscribed/:tournamentCategoryId", controller.getPlayersUnregistered);
router.post("/newPlayer", checkAuthenticated,controller.newPlayer);

module.exports = router;