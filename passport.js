const passport = require('passport');
const LocalStrategy = require('passport-local');
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStragegy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// define a stragegy to check if a user exists
// if so a callback function is executed
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    (username, password, callback) => {
      console.log(username + ' ' + password);
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
        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

// defina a stragey to verify a JWT signature
passport.use(
  new JWTStragegy(
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
