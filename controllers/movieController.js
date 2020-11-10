const User = require('../models/mongoDB/User');

const DATE_TO_DAYS = 60 * 60 * 24 * 1000;
const DAYS_TO_PASSWORD_MODIFFICATION = process.env.PASSWORD_TO_MODIFY;

const getMovie = async(req,res)=>{
    const {user_id} = req.session
    const {movieId} = req.params
    try{
        const user = await User.findById(user_id)
        // setting wether the user needs to change his password
        let LastPasswordModification = user.passwordLastModified / DATE_TO_DAYS;
        let today = new Date() / DATE_TO_DAYS;
        let dif = today - LastPasswordModification; // the time elapsed from the last password modification
        if(dif > DAYS_TO_PASSWORD_MODIFFICATION) return res.json({isMovieAccessible:"password"})

        const isMember = await user.get('isMember')
        if(isMember) return res.json({isMovieAccessible:true})
        const purchasedMovies = await user.get('purchasedMovies')
        let isMovieAccessible = purchasedMovies.some((movie)=>movie.movieId==movieId)
        if(isMovieAccessible) res.json({isMovieAccessible:true})
        else res.json({isMovieAccessible:false})
    }catch(err){
        console.log(err)
    }
}

const addMovie = async(req,res)=>{
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

}


module.exports.getMovie = getMovie;
module.exports.addMovie = addMovie;