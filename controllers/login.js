const express = require("express");
const router = express.Router();

const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const passwordToModify = require('../middleware/passwordToModify');


  
  const login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        await loginValidation(req.body);
        const user = await User.findOne({ email });

        if (!user) return res.json({ error: "Email or Password are invalid" });

        let comperdPassword = await bcrypt.checkPassword(password, user.password);
        if (!comperdPassword)
        return res.json({ error: "Email or Password are invalid" });
        const token = await JWT.generateToken(user._id, rememberMe);
        console.log('req.session.changePassword2',req.session.changePassword)
        if(req.session.changePassword){
        return res.json({ error: "need to change password" });
        } else {
            res.status(200).header("AuthToken", token).json({ token, userName:user.full_name });
        }
        next()
    } catch (e) {
      console.log(e);
    }
  };

//   module.exports.login1 = login1;
  module.exports.login = login;