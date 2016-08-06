var express = require('express');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('../config');
var dataLoader = require('../test-data/data-loader');
var cache = require('../data-memory');
var tools = require('./test-tools');

mongoose.Promise = require('bluebird');

var server;
var app = express();
var models;

before(function (done) {

	// connnect to database
	mongoose.connect(config.MONGODB);
	var db = mongoose.connection;

	db.on('error', function (err) {
		assert.isNotOk(err);
	});

	db.once('open', function () {

		models = require('../models');     // load models first
		var authentication = require('../authentication');
		var passport = require('passport');

		app.use(bodyParser.json());
		app.use(passport.initialize());
		
		// init api 
		app.use('/users', authentication.routes);
		app.use('/api/blu-store/', require('../api'));

		// bootstrap server
		server = app.listen(4000);
		done();

	});

});

after(function () {

	// shutdown server after finish tests
	server.close();

});

beforeEach(function (done) {
	// clear db
	tools.clearDb(done);
});

afterEach(function (done) {
	// clear db
	tools.clearDb(done);
});

describe('API tests', function () {
	require('./api');  // api tests folder
});

require('./auth');

