const passport = require('passport');
const LocalStrategy = require('passport-local');
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStragegy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;



