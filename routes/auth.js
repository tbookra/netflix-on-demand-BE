const router = require("express").Router();
const loginController = require('../controllers/login');
const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");
const passwordToModify = require('../middleware/passwordToModify');


router.post("/register", async (req, res) => {
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
});

router.post("/login",passwordToModify, loginController.login);

module.exports = router;
