const express = require("express");
const router = express.Router();

const controller = require("./gamesController");

router.get("/getGames/:tournamentCategoryId", controller.getGamesByTournamentCategoryId);
router.post("/registerGame", controller.registerGame);

module.exports = router;