const router = require("express").Router();
const User = require("../models/mongoDB/User");
const registerValidation = require("../validation/registerSchema");
const loginValidation = require("../validation/loginSchema");
const bcrypt = require("../auth/bcrypt");
const JWT = require("../auth/jwt");

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
    }).save();
    const token = await JWT.generateToken(user._id, rememberMe);
    res.header("AuthToken", token).json({ token, userName:user.full_name });
  } catch (err) {
    res.json(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    await loginValidation(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Email or Password are invalid" });
    let comperdPassword = await bcrypt.checkPassword(password, user.password);
    if (!comperdPassword)
      return res.json({ error: "Email or Password are invalid" });
    const token = await JWT.generateToken(user._id, rememberMe);
    res.header("AuthToken", token).json({ token, userName:user.full_name });
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
