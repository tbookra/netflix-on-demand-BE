const router = require("express").Router();
const authController = require('../controllers/authController');
const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const passwordToModify = require('../middleware/passwordToModify');


router.post("/register", authController.register);

router.post("/login",passwordToModify, authController.login);

router.post("/newPassword", authController.newPassword);

module.exports = router;
