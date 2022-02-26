const passport = require('passport');
const LocalStrategy = require('passport-local');
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

// create Users model and add the passport methods to the modeol
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// define a strategy to check if a user exists
// if so a callback function is executed
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },

    (username, password, callback) => {
      // check if this hashedPassword exists
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        
        if ( !user.validatePassword(password)) {
          console.log('incorrect password');
          return callback(null, false, {message: 'Incorrect password.'});
        }
        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

// define a strategy to verify a JWT signature
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
