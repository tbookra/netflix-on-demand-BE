const Users = require("../models/mongoDB/User");

module.exports = async (req, res, next) => {
  const { user_id } = req.session;
  const { email } = req.body;
  console.log("reqq", req.session);
  try {
    const user1 = user_id
      ? await Users.findById(user_id)
      : await Users.findOne({ email: email });
    if (email && !user1) {
      return res.json({ error: "Invalid email or password" });
    }
    const DATE_TO_DAYS = 60 * 60 * 24 * 1000;
    const DAYS_TO_PASSWORD_MODIFFICATION = process.env.PASSWORD_TO_MODIFY;
    let LastPasswordModification = user1.passwordLastModified / DATE_TO_DAYS;
    let today = new Date() / DATE_TO_DAYS;
    let dif = today - LastPasswordModification;
    if (dif < DAYS_TO_PASSWORD_MODIFFICATION) {
      // true meens no need to change password
      req.session.changePassword = false; // meens no need to change password
    } else {
      req.session.changePassword = true; // meens that password should change
      if (email) {
        return res.json({ error: "need to change password" });
      } else {
        return res.json({ isMovieAccessible: "password" });
      }
    }

    next();
  } catch (e) {
    console.log(e);
  }
};
