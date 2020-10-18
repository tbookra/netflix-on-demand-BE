const router = require("express").Router();
const User = require('../models/mongoDB/User')



router.get('/checkIfMovieAccessible/:movieId', async(req,res)=>{
const {movieId} = req.params
const {user_id} = req.session
try{
const user = await User.findById(user_id)
const movies = await user.get('purchasedMovies')
const isMovieInList = movies.filter(movie=>movie.movieId==movieId)
console.log(isMovieInList)
console.log(user)
console.log(movies)
}catch(err){
    console.log(err)
}
})

router.post('/addMovie', async(req,res)=>{
    const {movieId} = req.body
    const {user_id} = req.session
    try{
        const user = await User.findById(user_id)
        console.log(user.purchasedMovies)
        user.purchasedMovies=[...purchasedMovies, {movieId}]
        await user.save()
        // console.log(user.purchasedMovies)
    }catch(err){
        console.log(err)
    }

})


module.exports = router;
