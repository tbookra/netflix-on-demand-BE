const router = require("express").Router();
const movieController = require('../controllers/movieController');
const Users = require('../models/mongoDB/User');

router.get('/checkIfMovieAccessible/:movieId', movieController.getMovie)

router.post('/addMovie', movieController.addMovie)

router.post('/buyMembership', async(req,res)=>{
    //change user membership and validate
})


module.exports = router;
