const express = require("express");
const app = express();

const testEndPoint = require("./Routes/test/test");

app.use(express.urlencoded({ extended: true }));

app.use("/home", testEndPoint);

app.listen(3000, function () {
  console.log("Server started on port 3000");
});