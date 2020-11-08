const Users = require('../models/mongoDB/User');

module.exports = async (req, res, next) => {
  try{
    console.log('hello there')
    const DATE_TO_DAYS = 60 * 60 * 24 * 1000;
    const DAYS_TO_PASSWORD_MODIFFICATION = 0.005;
    const {email} = req.body;
    let user1 = await Users.findOne({email:email});
    console.log('user1', user1);
    console.log('user1.passwordLastModified',user1.passwordLastModified)
    let LastPasswordModification =
      user1.passwordLastModified / DATE_TO_DAYS;
    let today = new Date() / DATE_TO_DAYS;
    let dif = today - LastPasswordModification;
    if (dif < DAYS_TO_PASSWORD_MODIFFICATION) {
      // true meens no need to change password
      req.session.changePassword = false; // meens no need to change password
    } else {
      req.session.changePassword = true; // meens that password should change
    }
    console.log('req.session', req.session.changePassword )
    next()
  }catch (e) {
    console.log(e);
  }
  
};
