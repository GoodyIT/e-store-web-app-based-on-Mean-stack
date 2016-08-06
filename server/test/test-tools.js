'use strict';

/**
 * NOTE: this module have been loaded after connected 
 * to database so models will be available 
 * thanks to Node.js module cashing.
 */

var assert = require('chai').assert;

/**
 * load cashed version of models, the original
 * module loaded on main test page after 
 * connecting to db in "<server-root>/test/test.js" Ln:23 */
var models = require('../models');

// set models variables
var Category = models.Category;
var Product = models.Product;
var User = models.User;


// export variable and functions.
exports.Category = Category;
exports.Product = Product;

// orgnaize errors on screen
exports.printError = function (err, msg) {
	return msg + '\n' + err + '\n';
}

// drop all collections in the db
exports.clearDb = function (done) {
	// Make sure categories are empty before each test.
	Category.remove({}, function (err) {
		assert.isNotOk(err, 'error clearing categories!');

		Product.remove({}, function (err) {
			assert.isNotOk(err);
			User.remove({}, function (err) {
				assert.isNotOk(err);
				done();
			});
		});
	});
}

/**
 * handle http requests response 
 * if you provide object and validator the function 
 * will validate the http response body against the object 
 * you provided otherwise will just check the response state 
 * and status code and invoke the callback
 * */
exports.handleResponse = function (obj, validator, done) {

	if (arguments.length < 3) {
		done = obj;
		validator = null;
		obj = null;
	}

	return function (err, res) {
		assert.isNotOk(err);
		assert.equal(res.status, 200);
		assert.isOk(res.body.state);

		if (!obj) {
			return done(res);
		}

		if (Array.isArray(obj)) {
			assert.isOk(Array.isArray(res.body.data));
			assert.equal(res.body.data.length, obj.length);
			for (var x = 0; x < res.body.data; x++) {
				for (var i = 0; i < validator.length; i++) {
					assert.equal(res.body.data[x][validator[i]], obj[x][validator[i]]);
				}
			}
		}
		else {
			for (var i = 0; i < validator.length; i++) {
				assert.equal(res.body.data[validator[i]], obj[validator[i]]);
			}
		}
		done();
	}
};

exports.createDoc = function (model) {

	return function (data, done) {
		model.create(data, function (err, result) {
			assert.isNotOk(err);

			/**
			 * if result is array make sure it has at least one item
			 * if not assert result is not null 
			 */
			var isArray = Array.isArray(result);
			assert.isOk((isArray ? result.length > 0 : result));

			done(result);
		});
	}

};


// test config
exports.config = {
	server: {
		url: "http://localhost:4000/"
	}
};