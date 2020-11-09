const Users = require('../models/mongoDB/User');

module.exports = async (req, res, next) => {
  console.log('reqq',req.session)
  try{
    const DATE_TO_DAYS = 60 * 60 * 24 * 1000;
    const DAYS_TO_PASSWORD_MODIFFICATION = process.env.PASSWORD_TO_MODIFY;
    const {email} = req.body;
    let user1 = await Users.findOne({email:email});
    console.log('user1', user1)
    let LastPasswordModification =
    user1.passwordLastModified / DATE_TO_DAYS;
    let today = new Date() / DATE_TO_DAYS;
    let dif = today - LastPasswordModification;
    if (dif < DAYS_TO_PASSWORD_MODIFFICATION) {
      // true meens no need to change password
      req.session.changePassword = false; // meens no need to change password
    } else {
      req.session.changePassword = true; // meens that password should change
      return res.json({ error: "need to change password" });
    }
    next()
  }catch (e) {
    console.log(e);
  }
  
};
