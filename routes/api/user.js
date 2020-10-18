const express = require("express");
const router = express.Router();
const userschema = require('../../models/mongoDB/User');



router.post("/getUser", async (req, res) => {
    try {
        const {email} = req.body;
        let currentUser = await userschema.findOne({email});
    //   let user = await userschema.findOne({email: currentUser.email});
    //   console.log('user datum:', user);
      res.json({user: currentUser});
    } catch (e) {
      res.json(e);
    }
  });



module.exports = router;