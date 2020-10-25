const jwt = require("../auth/jwt");

module.exports = async (req, res, next) => {
  const token = req.header("AuthToken");
  if (!token) return res.status(401).json({error:"Access Denied"});
  try {
    const verified = await jwt.verifyToken(token);
    req.session.user_id = verified._id;
    next();
  } catch (err) {
    res.status(400).json({error:"Invalid Token"});
  }
};
