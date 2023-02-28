const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');

// Use this to connect to the local database during testing
// mongoose.connect('mongodb://localhost:27017/movingPictures', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Use this to connect to the online database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// references to the models
const Movies = Models.Movie;
const Users = Models.User;

const app = express();

const PORT = process.env.PORT || 3000;

// send back the timestamp of the request
const requestTime = (req, res, next) => {
  req.requestTime = new Date();
  next();
};

// tell the app to use the middleware functions for all requests
app.use(morgan('common'));
app.use(requestTime);
app.use(express.static('./public'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// import passport module
const passport = require('passport');
// import our passport.js file
require('./passport');
app.use(passport.initialize());

// install and use CORS
const cors = require('cors');
//
// allow all origins
// app.use(cors());
//
//define our CORS allowed origins
const allowedOrigins = [
  'http://localhost:1234',
  'http://localhost:1234/',
  'http://localhost:3000',
  'http://localhost:3000/',
  'https://pre-code-flix.netlify.app',
];

// call our CORS policy and check for origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const message =
          'The CORS policy for this application does not allow requests from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// import the auth endpoints
const auth = require('./auth')(app);
// GET requests

app.get('/', (req, res) => {
  res.send(`Welcome to myFlix.
   \n\n <small> You accessed this site at ${req.requestTime}</small>`);
});

/**
 * @description Endpoint to return movie database
 * Requires JWT Bearer token
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing all movie data
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // trying to query the db
    Movies.find()
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to get data for one movie by Title
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to get info about a genre
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object with genre info
 */
app.get(
  '/movies/:Title/Genre',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        if (movie) {
          res
            .status(201)
            .send(
              `The movie ${req.params.Title} is classified as a ${movie.Genre.Name}`
            );
        } else {
          res.status(404).send(`Cannot find movie "${req.params.Title}"`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to get info about the director of a movie
 * @method get
 * @param {string} endpoint - /movies/:Title/director
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/movies/:Title/director',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(201);
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// return data for a specific director
//
/**
 * @description Endpoint to get info about the director of a movie
 * @method get
 * @param {string} endpoint - /movies/:Title/director
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/directors/:name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name })
      .then((movie) => {
        res.status(201).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// return all user data
//
/**
 * @description Endpoint to get info about all users
 * @method get
 * @param {string} endpoint - /users
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .populate('FavMovies')
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to get info about the director of a movie
 * @method get
 * @param {string} endpoint - /users/:Username
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      // .populate('FavMovies')
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).end('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to create a new user
 * @method post
 * @param {req.body} - JSON object that looks like this:
 *  {
 * "Username": "johndoe",
 * "Password": "aStrongPasWwOOrd",
 * "Email" : "johndo@gmail.com",
 * "Birthday" : "1995-08-24"
 * }
 */
app.post(
  '/users',
  // validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphnumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    // check validation result
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() });
    }
    // hash user password through the req.body
    const hashedPassword = Users.hashPassword(req.body.Password);
    // Check if Username already exists
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        // if it exists return a message, else create the user
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            // the Model.create method takes an object that matches the model
            .create({
              Username: req.body.Username,
              // use the hashed password instead of the req.body Password
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday,
            })
            // send a confirmation response
            .then((user) => {
              res.status(201).send(`User '${user.Username}' created`);
            })
            // cath any error that occors during the creation, like a missing value or incorret datatype
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      // catch an error that occurs in the original query
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * @description Endpoint to update a user's data
 * @method put
 * @param {string} endpoint -/users/:Username/update
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing updated user data
 */
app.put(
  '/users/:Username/update',
  passport.authenticate('jwt', { session: false }),
  // validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphnumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    // check validation result
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() });
    }
    // hash the updated password
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      {
        Username: req.params.Username,
      },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      // this option returns the document that was updated
      { new: true },
      // here, demonstrating inclusion of error handling within a callback function
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @description Endpoint to delete a user account
 * @method delete
 * @param {string} endpoint - /users/:Username/delete
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {string} - confirmation message
 */
app.delete(
  '/users/:Username/delete',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to add movies to the user account
 * @method put
 * @param {string} endpoint - /users/:Username/movies/:MovieID
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object containing the user data
 */
app.put(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Return a users favorite movies
/**
 * @description Endpoint to get info about the director of a movie
 * @method get
 * @param {string} endpoint - /movies/:Title/director
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object
 */
app.get(
  '/users/:Username/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .populate('FavMovies')
      .then((user) => {
        if (user) {
          res.status(200).json(user.FavMovies);
        } else {
          res.status(404);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * @description Endpoint to remove a movie from a user's favorite movies
 * @method put
 * @param {string} endpoint - /users/:Username/movies/remove/:id
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {string} - confirmation message
 */
app.put(
  '/users/:Username/movies/remove/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        // the pull method removes a subdocument array only by id
        user.FavMovies.pull({ _id: req.params.id });
        // for the pull to take effect, we must save the document
        user.save();
        res.status(200).send('Movie removed');
        // user.save();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// listen for requests

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Your app is listening on port ${PORT}.`);
});
