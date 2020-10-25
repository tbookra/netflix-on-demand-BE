const router = require("express").Router();
const User = require('../models/mongoDB/User')

router.get('/getAccessibleMovies', async(req,res)=>{
    const {user_id} = req.session
    try{
        const user = await User.findById(user_id)
        const isMember = await user.get('isMember')
        const purchasedMovies = await user.get('purchasedMovies')
        res.status(200).json({isMember, purchasedMovies})
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


module.exports = router;
