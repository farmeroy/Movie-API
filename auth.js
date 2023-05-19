const jwtSecret = 'your_jwt_secret'; // This string has to have the same name used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // local passport file

/**
 * @description Create a JWT web token
 * @method generateJWTToken
 * @param {object} - An object containing the user data
 * @returns {string} - A jwt web token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // encode a Username
    subject: user.Username,
    // set an expiration date for the token
    expiresIn: '7d',
    // set the encoding algorithm
    algorithm: 'HS256',
  });
};

/**
 * @description Exported API enpoints
 */

module.exports = (router) => {
  /**
   * @description Endpoint for user login and authentication
   * Calls passport.authenticate and if credentials are valid redirects to the main view, otherwise denies access (throws an error)
   * @method postUserCredentials
   * @param {string} endpoint - /login
   *
   */
  router.post('/login', (req, res) => {
    console.log(req.body);
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          info: info,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({
          user: {
            Birthday: user.Birthday,
            Email: user.Email,
            FavMovies: [...user.FavMovies],
            Username: user.Username,
            _id: user._id,
          },
          token,
        });
      });
    })(req, res);
  });
};
