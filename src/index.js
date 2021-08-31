require('dotenv').config({ path: "../.env" });
const express = require("express");
const app = express();
const logger = require("morgan");

console.log(process.env.DB_USER)
const testEndPoint = require("./Routes/test/test");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/home", testEndPoint);

app.listen(3000, function () {
  console.log("Server started on port 3000");
});