const router = require("express").Router();
const movieController = require("../controllers/movieController");
const passwordToModify = require("../middleware/passwordToModify");
const Users = require("../models/mongoDB/User");

router.get(
  "/checkIfMovieAccessible/:movieId",
  passwordToModify,
  movieController.checkIfMovieAccessible
);

router.get("/getAccessibleMovies", async (req, res) => {
  const { user_id } = req.session;
  try {
    const user = await Users.findById(user_id);
    const isMember = await user.get("isMember");
    if (isMember) return res.json({ isMember });
    const accessibleMovies = await user.get("purchasedMovies");
    res.json({ accessibleMovies });
  } catch (err) {
    console.log(err);
  }
});

router.post("/addMovie", movieController.addMovie);

router.post("/membership/:type", async (req, res) => {
  const { user_id } = req.session;
  const type = req.params.type === "buy" ? true : false;
  try {
    const user = await Users.findById(user_id);
    user.isMember = type;
    await user.save();
    res.json({ membership: type });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
