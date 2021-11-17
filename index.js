const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uuid = require('uuid');

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
let directorsData = [{ name: 'Fritz Lang' }];

// DUMMY user data
let usersData = [{ userName: 'user1', movies: [{ title: 'It' }] }];

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
      .send(`The movie ${req.params.title} is classified as a ${movie.title}`);
  } else {
    res.status(404).send(`Cannot find movie "${req.params.title}"`);
  }
});

// return the data about directors in the database
app.get('/directors', (req, res) => {
  res.json(directorsData);
});

// return data for a specific director
app.get('/directors/:name', (req, res) => {
  res.json(
    directorsData.find((director) => {
      return director.name === req.params.name;
    })
  );
});

// return all user data
app.get('/users', (req, res) => {
  res.json(usersData);
});

// add a user
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.userName) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    usersData.push(newUser);
    res.status(201).send(newUser);
  }
});

// update user info
app.put('/users/:name/update/:newName', (req, res) => {
  let user = usersData.find((user) => {
    return user.userName === req.params.name;
  });

  if (user) {
    let oldName = user.userName;
    user.userName = req.params.newName;
    res.status(201).send(`User '${oldName}' is now '${user.userName}'.`);
  } else {
    res.status(404).send(`There is no user with name '${req.params.name}'.`);
  }
});

// delete user account
app.delete('/users/:userName/delete', (req, res) => {
  let user = usersData.find((user) => {
    return user.userName === req.params.userName;
  });
  if (user) {
    usersData = usersData.filter((obj) => {
      return obj.userName !== req.params.userName;
    });
    res
      .status(201)
      .send(`User '${req.params.userName}' was deleted from database.`);
  } else {
    res
      .status(404)
      .send(`Could not find user with user name '${req.params.userName}'.`);
  }
});

// add movies to the user account
app.put('/users/:userName/movies', (req, res) => {
  let user = usersData.find((user) => {
    return user.userName === req.params.userName;
  });
  if (user) {
    if (!user.movies) {
      user.movies = [];
    }
    user.movies.push(req.body);
    res.status(201).send(`'${req.body.title}' added to movie list`);
  } else {
    res
      .status(404)
      .send(`Could not find user with user name '${req.params.userName}'.`);
  }
});

// listen for requests

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});
