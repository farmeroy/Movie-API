const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define a mongose schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

// this method hashes a new user's password
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// this method hashes a password on login to compare to the stored hashed password
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
};

// Create the models that will be used in the index.js to interact with the database
//
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
