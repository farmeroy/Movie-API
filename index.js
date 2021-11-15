const express = require("express");
const app = express();

let favMovies = [
  { title: "the Immigrant", director: "Charlie Chaplin" },
  {
    title: "M",
    director: "Fritz Lang",
  },
  { title: "the Big Labowski", director: "the Cohen Brothers" },
];

// write middleware functions
//
// here is url logging function, it logs the URL request
const myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

// send back the timestamp of the request
const requestTime = (req, res, next) => {
  req.requestTime = new Date();
  next();
};

// tell the app to use the middleware funtions for all requests
app.use(myLogger);
app.use(requestTime);

// GET requests
app.get("/", (req, res) => {
  res.send(`Welcome to myFlix.
   \n\n <small> You accessed this site at ${req.requestTime}</small>`);
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(favMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
