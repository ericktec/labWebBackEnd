const express = require("express");
const passport = require('passport');
const router = express.Router();

const controller = require("./authController");

router.post("/signup", controller.signUp);
router.post("/login", passport.authenticate("local"), controller.logIn);
router.delete("/logout", controller.logOut);
router.get("/test", (req, res) => {
  console.log(req.user)
  res.json({ user: req.user })
});

module.exports = router;