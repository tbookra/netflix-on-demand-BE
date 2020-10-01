const jwt = require("jsonwebtoken");

const generateToken = (data, rememberMe) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: data },
      process.env.TOKEN_KEY,
      { expiresIn: rememberMe ? "30d" : "1h" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
