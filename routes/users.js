const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("respond with a resource");
});

module.exports = router;
