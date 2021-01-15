const router = require("express").Router();
const movieController = require("../controllers/movieController");
const passwordToModify = require("../middleware/passwordToModify");
const Users = require("../models/mongoDB/User");

router.get(
  "/checkIfMovieAccessible/:movieId",
  passwordToModify,
  movieController.checkIfMovieAccessible
);

router.get("/getAccessibleMovies/:page", async (req, res) => {
  const PAGE_OFFSET = 8;
  let currentPage = 1;
  const { user_id } = req.session;
  const { page } = req.params;
  if (!page || page < 1) {
    currentPage = 1;
  } else {
    currentPage = page;
  }
  let start_index = (currentPage - 1) * PAGE_OFFSET;
  let end_index = start_index + PAGE_OFFSET;
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
