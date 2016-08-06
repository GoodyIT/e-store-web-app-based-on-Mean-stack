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

	it('can register user', function (done) {

		var user = userData[0];

		var registerUrl = url + 'users/register';

		superagent.post(registerUrl).send(user).end(handleResponse(function (res) {

			User.findOne({ username: user.username }, function (err, result) {
				assert.isNotOk(err);
				assert.isOk(result);
				assert.equal(result.firstname, user.firstname);
				assert.equal(result.lastname, user.lastname);
				assert.equal(result.email, user.email);
				assert.equal(result.admin, false);
				done();
			});

		}));



	});

	it('can login user', function (done) {

		var user = userData[0];

		// add user to db so we can use it to test login
		dataLoader.loadUsers(User, user, function (err) {
			// login the new user 
			superagent.post(url + 'users/login')
				.send({ username: user.username, password: user.password })
				.end(handleResponse(function (res) {
					assert.isOk(res.body.token);
					done();
				}));

		});

	});

});

function registerUser(user, done) {




}