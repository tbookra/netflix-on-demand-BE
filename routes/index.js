const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("INDEX");
});

module.exports = router;
