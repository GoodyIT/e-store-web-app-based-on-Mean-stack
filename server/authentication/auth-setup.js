var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models').User;

passport.use(new LocalStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;

