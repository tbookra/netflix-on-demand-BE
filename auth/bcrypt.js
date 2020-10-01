const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  });
};

const checkPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports.hashPassword = hashPassword;
module.exports.checkPassword = checkPassword;
