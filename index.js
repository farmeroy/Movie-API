const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const app = express();

const PORT = 8080;

let favMovies = [
  { title: 'the Immigrant', director: 'Charlie Chaplin' },
  {
    title: 'M',
    director: 'Fritz Lang',
  },
  { title: 'the Big Labowski', director: 'the Cohen Brothers' },
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

app.use(bodyParser.urlencoded({
  extended: true
}));

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


app.get('/movies', (req, res) => {
  res.json(favMovies);
});

// listen for requests
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});
