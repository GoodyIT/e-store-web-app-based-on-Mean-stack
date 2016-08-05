'use strict';

var Product = require('../models').Product;
var handler = require('./handler');

// get all products from database
exports.getAll = function (req, res) {
	Product.find({}, handler(res));
};

// add new product to db
exports.addNew = function (req, res) {
	Product.create(req.body, handler(res));
};

// get product by id 
exports.getById = function (req, res) {
	Product.findOne({ _id: req.params.id }, handler(res));
};

// delete product by id
exports.deleteById = function (req, res) {
	Product.remove({ _id: req.params.id }, handler(res));
};

// update product and return it
exports.updateById = function (req, res) {
	Product.findByIdAndUpdate(
		req.params.id, 
		{ $set: req.body }, 
		{ new: true, runValidators: true },
		 handler(res)
	);
};