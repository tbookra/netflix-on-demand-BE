const { boolean } = require("@hapi/joi");
const mongoose = require("mongoose");

const movie = new mongoose.Schema({
  movieId:{
    type:String,
    max:255
  }
})

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
  },
  status:{
    type: String,
    default: 'active',
  },
  isConfirmed:{
    type:Boolean,
    default:false
  },
  isMember:{
    type:Boolean,
    default:false
  },

  purchasedMovies:[movie],

  registrationDate: {
    type: Date,
    default: Date.now,
  },
  passwordLastModified: {
    type: Date,
    
  }
});

module.exports = mongoose.model("User", userSchema);
