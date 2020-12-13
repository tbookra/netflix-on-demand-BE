const Users = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const newPasswordValidation = require("../validation/newPasswordSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const e = require("express");
const nodemailer = require('../auth/nodeMailer');
const { connect } = require("mongoose");


 const register = async (req, res) => {
      const { full_name, email, password, rememberMe } = req.body;
     try {
      await registerValidation(req.body);
      const emailExist = await Users.findOne({$and:[{ email },{status: 'active'},{isConfirmed: true}]});
      if (emailExist) return res.json({ error: "Email already exists" });
      const hashPassword = await bcrypt.hashPassword(password);
      const oldUser = await Users.findOne({ email });
      const user = !oldUser ? await new Users({
        full_name,
        email,
        password: hashPassword,
        passwordLastModified: Date.now(),
      }).save() :
      await Users.updateOne({_id: oldUser._id},{$set:{
        password:hashPassword,
        passwordLastModified: Date.now(),
        full_name:full_name,
        status: 'not_active',
        isConfirmed: false,
      }});
      const userObj = {full_name, email, rememberMe}
      await nodemailer.sendEmail(userObj, "register");
      res.json({confirm: 'confirm'})
  
    } catch (err) {
      res.status(500).json(err);
    }
  }
  

  const login = async (req, res, next) => {
        const { email, password, rememberMe } = req.body;
    try {
        await loginValidation(req.body);
        let user = await Users.findOne({$and:[{ email },{status: 'active'}]});
        if (!user) return res.json({ error: "Email or Password are invalid" });
        user = await Users.findOne({$and:[{ email },{isConfirmed: true}]});
        if (!user) return res.json({ error: "This Email hasn't been confirmed yet!" });
        let comperdPassword = await bcrypt.checkPassword(password, user.password);
        if (!comperdPassword)
        return res.json({ error: "Email or Password are invalid" });
        const token = await JWT.generateToken(user._id, rememberMe);
        if(req.session.changePassword){
        return res.json({ error: "need to change password" });
        } else {
          res.status(200).header("AuthToken", token).json({ token, userObj:user });
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
        let user = await Users.findOne({$and:[{ email },{status: 'active'}]});
        if (!user) return res.json({ error: "No such user exists. would you like to register?" });
        let comperdPassword = await bcrypt.checkPassword(new_password, user.password);
        if (comperdPassword) return res.json({ error: "You have to choose a new password!" });
        const newHashPassword = await bcrypt.hashPassword(new_password);
        const token = await JWT.generateToken(user._id, false);
        req.session.changePassword = false;
        await Users.updateOne({_id: user._id},{$set:{password:newHashPassword, passwordLastModified: Date.now()}});
        const userObj = {
          full_name: user.full_name,
          email,
          rememberMe: "false",
        }
        await nodemailer.sendEmail(userObj ,"password");
        res.status(200).header("AuthToken", token).json({ token, userObj:user });
     
        next()
    } catch (e) {
      console.log(e);
    }
  };

 

  const confirmed  = async (req, res, next) => {
        const {email,rememberMe} = req.params;  
   
    try{
        const newUser = await Users.findOne({ email });
        await Users.updateOne({_id: newUser._id},{$set:{status: 'active', isConfirmed: true}});
        const token = await JWT.generateToken(newUser._id, rememberMe);
        res.status(200).header("AuthToken", token).json({ token, userObj:newUser });
     
    }catch(e){
      console.log(e)
    }
  };

  const emailResend  = async (req, res, next) => {
    const {userEmail,rememberMe} = req.body;
      try{
        const user = await Users.findOne({ email:userEmail });
        const userObj = {
          full_name: user.full_name,
          email: userEmail,
          rememberMe,
        }
        await nodemailer.sendEmail(userObj, "register");
      }catch(e){
            console.log(e)
          }
  }

  const deleteUser = async (req, res, next) => {
    const {email} = req.params;
    try{
      const user = await Users.findOne({ email });
      // await Users.deleteOne({email})
      await Users.updateOne({_id: user._id},{$set:{
        password:"",
        passwordLastModified: Date.now(),
        status: 'not_active',
        isConfirmed: false,
      }});
      res.status(200).json({deleted: true});
    }catch(e){
      console.log(e)
    }
  }

  module.exports.register = register;
  module.exports.login = login;
  module.exports.newPassword = newPassword;
  module.exports.confirmed = confirmed;
  module.exports.emailResend = emailResend;
  module.exports.deleteUser = deleteUser;