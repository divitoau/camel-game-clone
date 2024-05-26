const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the board game server!");
});

module.exports = router;
