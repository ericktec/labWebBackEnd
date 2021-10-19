const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../../Middleware/auth");

const controller = require("./tournamentController");

router.get("/allTournaments", controller.getTournaments);
router.post("/createTournament", checkAuthenticated, controller.createTournament);
router.post("/registerPlayer", checkAuthenticated, controller.registerPlayer);

module.exports = router;