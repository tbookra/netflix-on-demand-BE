const router = require("express").Router();
const loginController = require('../controllers/login');
const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const passwordToModify = require('../middleware/passwordToModify');


router.post("/register", loginController.register);

router.post("/login",passwordToModify, loginController.login);

router.post("/newPassword", loginController.newPassword);

module.exports = router;
