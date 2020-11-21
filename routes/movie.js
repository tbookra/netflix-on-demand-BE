const router = require("express").Router();
const movieController = require("../controllers/movieController");
const passwordToModify = require("../middleware/passwordToModify");
const Users = require("../models/mongoDB/User");

router.get(
  "/checkIfMovieAccessible/:movieId",
  passwordToModify,
  movieController.getMovie
);

router.post("/addMovie", movieController.addMovie);

router.post("/buyMembership", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    const isMember = user.get("isMember");
    if (isMember) return res.json({ membership: "you already a member" });
    user.isMember = true;
    user.save();
    res.json({ membership: "successfully member" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
