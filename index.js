const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uuid = require('uuid');

const app = express();

const PORT = 3000;

let moviesData = [
  {
    _id: 'ObjectId("619773d2afb0f0cd425c0e63")',
    Title: 'M',
    Description:
      'When the police in Berlin are unable to catch a child-murderer, other criminals join in the manhung.',
    Genre: {
      Name: 'Thriller',
      Description:
        'Thriller, or suspense, film is a broad genre that feature exciting plots, often dealing with criminality.',
    },
    Director: {
      Name: 'Fritz Lang',
      Bio: 'Fritz Lang was one of the most influential of the German expressionist film makers. He escaped Nazi Germany before World War II.',
      Birth: '1890',
      Death: '1976',
    },
    ImagePath: 'm.png',
    Featured: true,
    Actors: ['Peter Lorre'],
  },
  {
    _id: 'ObjectId("6197a168afb0f0cd425c0e64")',
    Title: 'Modern Times',
    Description:
      'The Tramp struggles to live in modern industrial society with the help of a young homeless woman.',
    Genre: {
      Name: 'Comedy',
      Description: 'A funny movie',
    },
    Director: {
      Name: 'Charlie Chaplin',
      Bio: 'Sir Charles Spencer Chaplin Jr. KBE was a English comic actor, filmmaker, and composer who rose to fame in the era of silent film. He became a worldwide icon through his screen persona, The Tramp, and is considered one of the most important figures in the history of the film industry. Although he was internationally admired, he was persecuted by the US government and accused of being a communist. He eventually lived a life of exile in Vevey, Switzerland.',
      Birth: '1889',
      Death: '1977',
    },
    ImagePath: 'modern-times.png',
    Featured: true,
    Actors: ['Charlie Chaplin'],
  },
];

// DUMMY user data
let usersData = [
  {
    _id: 'ObjectId("6197dd31afb0f0cd425c0e70")',
    UserName: 'filmlover4',
    Password: '1234',
    Email: '5678',
    Birthday: 'ISODate("1970-01-01T00:00:01.976Z")',
    FavMovies: [],
  },
  {
    _id: 'ObjectId("6197de26afb0f0cd425c0e72")',
    UserName: 'babyrosebud',
    Password: 'childhoodmemory',
    Email: 'sentimentaluser@aol.com',
    Birthday: 'ISODate("1955-02-14T00:00:00Z")',
    FavMovies: [],
  },
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
app.get('/movies/:Title', (req, res) => {
  res.json(
    moviesData.find((movie) => {
      return movie.Title === req.params.Title;
    })
  );
});

// return the genre of a movie
app.get('/movies/:Title/Genre', (req, res) => {
  let movie = moviesData.find((movie) => {
    return movie.Title === req.params.Title;
  });

  if (movie) {
    res
      .status(201)
      .send(`The movie ${req.params.Title} is classified as a ${movie.Genre.Name}`);
  } else {
    res.status(404).send(`Cannot find movie "${req.params.Title}"`);
  }
});

// return the data about directors in the database
app.get('/movies/:title/:director', (req, res) => {
  res.send(
    '{ this returns a json with information about the movie\'s director }'
  );
});

// return data for a specific director
app.get('/directors/:name', (req, res) => {
  res.json(
    directorsData.find((direcor) => {
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
    return user.UserName === req.params.name;
  });

  if (user) {
    let oldName = user.UserName;
    user.UserName = req.params.newName;
    res.status(201).send(`User '${oldName}' is now '${user.UserName}'.`);
  } else {
    res.status(404).send(`There is no user with name '${req.params.name}'.`);
  }
});

// delete user account
app.delete('/users/:userName/delete', (req, res) => {
  let user = usersData.find((user) => {
    return user.UserName === req.params.userName;
  });
  if (user) {
    usersData = usersData.filter((obj) => {
      return obj.UserName !== req.params.userName;
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
    return user.UserName === req.params.userName;
  });
  if (user) {
    if (!user.FavMovies) {
      user.FavMovies = [];
    }
    user.FavMovies.push(req.body);
    res.status(201).send(`'${req.body.Title}' added to movie list`);
  } else {
    res
      .status(404)
      .send(`Could not find user with user name '${req.params.UserName}'.`);
  }
});

// remove movie from user account
app.delete('/users/:userName/movies/:Title', (req, res) => {
  let user = usersData.find((user) => {
    return user.UserName === req.params.userName;
  });
  if (user) {
    user.FavMovies === user.movies.filter((obj) => {
      return obj.Title !== req.params.Title;
    });
    res.status(201).send(`${req.params.Title} was removed from movies list.`);
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
