const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define a mongose schema
/**
 * @description The mongoose schema for a the Movies
 * {
 * Title: { type: String, required: true },
 * Description: { type: String, required: true },
 * Genre: {
 *   Name: String,
 *   Description: String,
 * },
 * Director: {
 *   Name: String,
 *   Bio: String,
 * },
 * Actors: [String],
 * ImagePath: String,
 * Featured: Boolean,
 *}
 */
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

/**
 * @description mongoose schema for the user object
 *{
 * Username: { type: String, required: true },
 * Password: { type: String, required: true },
 * Email: { type: String, required: true },
 * Birthday: Date,
 * FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
 * }
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * @description Hash a password with bcrypt
 * @param {string} - password string
 * @returns {string} - password hash
 */
userSchema.statics.hashPassword = (password) => {
  // Although the bcrypt docs say to use the async method on servers, the sync method works better here
  return bcrypt.hashSync(password, 10);
};

/**
 * @description Validate an entered password by comparing it to the stored password hash
 * @param {string} - password string
 * @returns {boolean}
 */
// use 'function syntax to maintain correct .this reference
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Create the models that will be used in the index.js to interact with the database
//
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
