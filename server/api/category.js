'use strict';

var Category = require('../models').Category;
var handler = require('./handler');

/**
 * thanks to Node.js module caching 
 * this require will use the same instance 
 * defined in app.js or unit-tests
 */
var cache = require('../data-memory');

// get all products from database
exports.getAll = function (req, res) {

	var format = req.query.format;

	if (format === 'doc') {
		cache.get('categoriesDoc', handler(res));
	}
	else {
		cache.get('categoriesTree', handler(res));
	}

};

exports.addNew = function (req, res) {

	var cate = {
		name: req.body.name
	};

	// if category have parent
	if (req.body.parent) {
		// find this parent and add a child to it
		Category.findOne({ _id: req.body.parent }, function (err, parent) {
			// if parent not found
			if (err) {
				return handler(res)(err);
			}

			// if parent found
			parent.addChild(cate, handler(res, function (done) {
				// do before send response back
				cache.get('refreshCategories')(done);
			}));

		});
	}
	else {
		
		// create new category and return it
		Category.create(req.body, handler(res, function (done) {
			// do before send response back
			cache.get('refreshCategories')(done);
		}));
		
	}

};

exports.getById = function (req, res) {
	handler(res)(null, findCatById(req.params.id));
};

function findCatById(id) {
	var result = {}
	cache.get('categoriesDoc', function (err, value) {
		;
		if (!err && value) {
			result = cache.get('categoriesDoc').filter(function (obj) {
				return obj._id.toString() === id.toString();
			})[0];
		}
	});
	return result;
}

