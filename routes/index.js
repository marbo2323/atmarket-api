var express = require("express");
var router = express.Router();

// setup a friendly greeting for the root route
router.get("/", function (req, res, next) {
  res.json({
    message: "Welcome to the At Market REST API!",
  });
});

module.exports = router;
