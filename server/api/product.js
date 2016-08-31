'use strict';

var Product = require('../models').Product;
var handler = require('./handler');
var cache = require('../data-memory');

// get all products from database
exports.getAll = function (req, res) {
	//Product.find({}, handler(res));
	Product.find({}).populate('category').exec(handler(res));
};

// add new product to db
exports.addNew = function (req, res) {
	Product.create(req.body, handler(res));
};

// get product by id 
exports.getById = function (req, res) {
	Product.findOne({ _id: req.params.id }).populate('category').exec(handler(res));
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

exports.getByCategoryId = function(req, res){

	var catId = req.params.id;
	var categories = [];

	// get all child categories from cache memory
	cache.get('categoriesDoc', function(err, cats){

		if(err){
			return handler(res)(err);
		}

		categories = cats.filter(function(obj){
			return obj.ancestors.indexOf(catId) != -1;
		});

		categories.push(catId);

		Product.find({ category: { $in: categories } }, handler(res));

	});

};