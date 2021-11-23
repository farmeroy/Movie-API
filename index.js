const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// import mongoose and our models
const mongoose = require('mongoose');
const Models = require('./models.js');

// references to the models
const Movies = Models.Movie;
const Users = Models.User;

// Connect to the database
mongoose.connect('mongodb://localhost:27017/movingPictures', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

const PORT = 3000;

// send back the timestamp of the request
const requestTime = (req, res, next) => {
  req.requestTime = new Date();
  next();
};

// tell the app to use the middleware funtions for all requests

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

// GET requests
app.get('/', (req, res) => {
  res.send(`Welcome to myFlix.
   \n\n <small> You accessed this site at ${req.requestTime}</small>`);
});

// get the entire movie database
app.get('/movies', (req, res) => {
  // trying to query the db
  Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// return the data for a specific movie
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return the genre of a movie
app.get('/movies/:Title/Genre', (req, res) => {
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
});

// return the data about directors in the database
app.get('/movies/:Title/director', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201);
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data for a specific director
app.get('/directors/:name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return all user data
app.get('/users', (req, res) => {
  Users.find()
    .populate('FavMovies')
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// return data for a specific user
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .populate('FavMovies')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end('Error: ' + err);
    });
});

// add a user
app.post('/users', (req, res) => {
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
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          // send a confirmation response
          .then((user) => {
            res.status(201).json(user);
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
});

// update user info
app.put('/users/:Username/update', (req, res) => {
  Users.findOneAndUpdate(
    {
      Username: req.params.Username,
    },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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
});

// delete user account
app.delete('/users/:Username/delete', (req, res) => {
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
});

// add movies to the user account
app.put('/users/:Username/movies/:MovieID', (req, res) => {
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
});

// Return a users favorite movies
app.get('/users/:Username/movies', (req, res) => {
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
});

// remove movie from user's FavMovies
app.put('/users/:Username/movies/remove/:id', (req, res) => {
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
});
// listen for requests

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});
