'use strict';

var Category = require('../models').Category;
var handler = require('./handler');

// get all products from database
exports.getAll = function (req, res) {
	Category.find({}, handler(res));
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
			parent.addChild(cate, handler(res));

		});
	}
	else {
		
		// create new category and return it
		Category.create(req.body, handler(res));
		
	}

};

exports.getById = function (req, res) {
	Category.findOne({ _id: req.params.id }, handler(res));
};