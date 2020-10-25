const router = require("express").Router();
const User = require('../models/mongoDB/User')



router.get('/checkIfMovieAccessible/:movieId', async(req,res)=>{
const {movieId} = req.params
const {user_id} = req.session
try{
    const user = await User.findById(user_id)
    if(user.isMember) return res.json({isMovieAccessible:true})
    const purchasedMovies = await user.get('purchasedMovies')
    const isMovieInList = purchasedMovies.filter(movie=>movie.movieId===movieId)
    console.log('isInMovie',isMovieInList)
    if(isMovieInList.length===0) res.json({isMovieAccessible:false})
    else  res.json({isMovieAccessible:true})
}catch(err){
    console.log(err)
}
})

router.get('/getAccessibleMovies', async(req,res)=>{
const {user_id} = req.session
try{
    const user = await User.findById(user_id)
    const isMember = await user.get('isMember')
    const purchasedMovies = await user.get('purchasedMovies')
    res.json({isMember, purchasedMovies})
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
        res.json({added:true})
        }else{
         res.json({added:false})
        }
        
        console.log(user.purchasedMovies)
    }catch(err){
        console.log(err)
    }

})


module.exports = router;
