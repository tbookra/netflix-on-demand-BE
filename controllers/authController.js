const express = require("express");
const router = express.Router();

const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const newPasswordValidation = require("../validation/newPasswordSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const passwordToModify = require('../middleware/passwordToModify');

 const register = async (req, res) => {
    const { full_name, email, password, rememberMe } = req.body;
    try {
      await registerValidation(req.body);
      const emailExist = await User.findOne({ email });
      if (emailExist) return res.json({ error: "Email already exists" });
      const hashPassword = await bcrypt.hashPassword(password);
      const user = await new User({
        full_name,
        email,
        password: hashPassword,
        passwordLastModified: Date.now(),
      }).save();
      const token = await JWT.generateToken(user._id, rememberMe);
      res.status(200).header("AuthToken", token).json({ token, userName:full_name });
  
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
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

  const newPassword = async (req, res, next) => {
    const {  new_password, email } = req.body;
    try {
        await newPasswordValidation(req.body);
        let user = await User.findOne({ email });
        if (!user) return res.json({ error: "No such user exists" });
        let comperdPassword = await bcrypt.checkPassword(new_password, user.password);
        if (comperdPassword) return res.json({ error: "You have to choose a new password!" });
        const newHashPassword = await bcrypt.hashPassword(new_password);
        const token = await JWT.generateToken(user._id, false);
        req.session.changePassword = false;
        await User.updateOne({email: email},{$set:{password:newHashPassword, passwordLastModified: Date.now()}});
        res.status(200).header("AuthToken", token).json({ token, userName:user.full_name });
     
        next()
    } catch (e) {
      console.log(e);
    }
  };

  module.exports.register = register;
  module.exports.login = login;
  module.exports.newPassword = newPassword;