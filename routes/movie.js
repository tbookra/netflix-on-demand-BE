const router = require("express").Router();
const movieController = require('../controllers/movieController');
const passwordToModify = require('../middleware/passwordToModify');

router.get('/checkIfMovieAccessible/:movieId',passwordToModify, movieController.getMovie)

router.post('/addMovie', movieController.addMovie)

router.post('/buyMembership', async(req,res)=>{
    //change user membership and validate
})


module.exports = router;
