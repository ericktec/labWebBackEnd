const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../../Middleware/auth");

const controller = require("./gamesController");

router.get("/getGames/:tournamentCategoryId", controller.getGamesByTournamentCategoryId);
router.post("/registerGame", checkAuthenticated, controller.registerGame);

module.exports = router;