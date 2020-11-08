const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/tokenVerify");
const passwordToModify = require('../middleware/passwordToModify');

router.get("/",passwordToModify, tokenVerify, async (req, res) => {
  console.log(req.session.user_id);
  console.log('indexxx', req.session.currentUser)
  res.send("INDEX");
});

module.exports = router;
