const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../../Middleware/auth");

const controller = require("./tournamentController");

router.get("/allTournaments", controller.getTournaments);
router.post("/createTournament", checkAuthenticated, controller.createTournament);

module.exports = router;