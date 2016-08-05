var authSetup = require('./auth-setup');
var userRoutes = require('./user-routes');
var verify = require('./verify');

exports.init = authSetup.initialize;
exports.routes = userRoutes;