var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var handleResponse = tools.handleResponse;
var models = require('../../models');
var dataLoader = require('../../test-data/data-loader');

var config = tools.config;
var url = config.server.url;
var User = models.User;
var userData = dataLoader.usersData;

describe('Authentication', function () {

	it('can register user');

	it('can login user', function (done) {

		var user = userData[0];

		// add user to db so we can use it to test login
		dataLoader.loadUsers(User, user, function (err) {
			// login the new user 
			superagent.post(url + 'users/login')
				.send({ username: user.username, password: user.password })
				.end(handleResponse(function (err, res) {
					assert.isOk(res.body.token);
					done();
				}));

		});

	});

});