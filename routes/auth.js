const router = require("express").Router();
const authController = require('../controllers/authController');
const passwordToModify = require('../middleware/passwordToModify');


router.post("/register", authController.register);

router.post("/login",passwordToModify, authController.login);

router.post("/newPassword", authController.newPassword);

// router.get("/userConfirmation", authController.userConfirmation);

router.get("/confirmed/:email", authController.confirmed);

router.get("/deleteUser/:email", authController.deleteUser);

module.exports = router;
