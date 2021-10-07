const express = require("express");
const router = express.Router();

const controller = require("./authController");

router.post("/signup", controller.signUp);
router.post("/login", controller.logIn);


module.exports = router;