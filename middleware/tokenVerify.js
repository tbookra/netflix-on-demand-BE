const jwt = require("../auth/jwt");

module.exports = async (req, res, next) => {
  const token = req.header("Auth-Token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = await jwt.verifyToken(token);
    req.user_id = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
