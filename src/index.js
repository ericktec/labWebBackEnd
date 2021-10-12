require('dotenv').config({ path: "../.env" });
const express = require("express");
const app = express();
const logger = require("morgan");
const passport = require("passport");
const initializePassport = require("./Config/passport-config")
const cookieParser = require("cookie-parser");
const session = require('express-session');

//Routes-----------------------------------------------
const authentication = require("./Routes/auth/auth");
const tournaments = require("./Routes/tournaments/tournament");
const players = require("./Routes/players/players");


initializePassport(passport);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authentication);
app.use("/tournaments", tournaments)
app.use("/players", players);

app.listen(3000, function () {
  console.log("Server started on port 3000");
});