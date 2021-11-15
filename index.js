const express = require("express"); const app = express();

let favMovies = [ { title: 'the Immigrant', director: 'Charlie Chaplin' }, {
  title: 'M', director: 'Fritz Lang' }, { title: 'the Big Labowski', director:
    'the Cohen Brothers' } ];

// GET requests
app.get('/', (req, res) => { res.send('Welcome to myFlix'); });

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname }); });

app.get('/movies', (req, res) => { res.json(favMovies) });

// listen for requests
app.listen(8080, () => { console.log('Your app is listening on port 8080.');
});

