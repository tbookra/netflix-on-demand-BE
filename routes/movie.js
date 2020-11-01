const router = require("express").Router();
const User = require('../models/mongoDB/User')


router.get('/checkIfMovieAccessible/:movieId', async(req,res)=>{
    const {user_id} = req.session
    const {movieId} = req.params
    try{
        const user = await User.findById(user_id)
        const isMember = await user.get('isMember')
        if(isMember) return res.json({isMovieAccessible:true})
        const purchasedMovies = await user.get('purchasedMovies')
        let isMovieAccessible = purchasedMovies.some((movie)=>movie.movieId==movieId)
        if(isMovieAccessible) res.json({isMovieAccessible:true})
        else res.json({isMovieAccessible:false})
    }catch(err){
        console.log(err)
    }
})

router.post('/addMovie', async(req,res)=>{
    const {movieId} = req.body
    const {user_id} = req.session
    try{
        const user = await User.findById(user_id)
        const isMovieInList = user.purchasedMovies.filter(movie=>movie.movieId===movieId)
        if(isMovieInList.length===0){
            user.purchasedMovies=[...user.purchasedMovies, {movieId}]
        await user.save()
        res.status(200).json({added:true})
        }else{
         res.status(200).json({added:false})
        }
        
        console.log(user.purchasedMovies)
    }catch(err){
        console.log(err)
    }

})

router.post('/buyMembership', async(req,res)=>{
    //change user membership and validate
})


module.exports = router;
