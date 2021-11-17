const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

const PORT = 3000;

let moviesData = [
  { title: 'the Immigrant', director: 'Charlie Chaplin' },
  {
    title: 'M',
    director: 'Fritz Lang',
  },
  { title: 'the Big Labowski', director: 'the Cohen Brothers' },
];
//DUMMY directors data
let directorsData = [
  { name: "Fritz Lang" }
];


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
  res.json(moviesData);
});

// return the data for a specific movie
app.get('/movies/:title', (req, res) => {
  res.json(
    moviesData.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

// return the genre of a movie
app.get('/movies/:title/genre', (req, res) => {
  let movie = moviesData.find((movie) => {
    return movie.title === req.params.title;
  });

  if (movie) {
    res
      .status(201)
      .send(
        `The movie ${req.params.title} is classified as a ${movie.title}`
      );
  } else {
    res.status(404).send(`Cannot find movie "${req.params.title}"`);
  }
});

// return the data about directors in the database
app.get('/directors', (req, res) => {
  res.json(
// listen for requests
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});
