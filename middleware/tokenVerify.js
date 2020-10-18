const jwt = require("../auth/jwt");

module.exports = async (req, res, next) => {
  const token = req.header("AuthToken");
  if (!token) return res.send("Access Denied");
  try {
    const verified = await jwt.verifyToken(token);
    req.session.user_id = verified._id;
    next();
  } catch (err) {
    res.send("Invalid Token");
  }
};
