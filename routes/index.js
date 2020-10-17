const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/tokenVerify");

router.get("/", tokenVerify, async (req, res) => {
  console.log(req.user_id);
  console.log('indexxx', req.session.currentUser)
  res.send("INDEX");
});

module.exports = router;
