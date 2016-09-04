'use strict';

var Product = require('../models').Product;
var handler = require('./handler');
var cache = require('../data-memory');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/public/images/products/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + "-" + datetimestamp + "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]);
    }
});

var upload = multer({ storage: storage }).single('file');

// load cached data
cache.get('loadCache')(function () {
    console.log('cached objects loaded');
});

// get all products from database
exports.getAll = function (req, res) {
	//Product.find({}, handler(res));
	Product.find({}).populate('category').exec(handler(res));
};

// "POST" add new product to db
exports.addNew = function (req, res) {

	upload(req, res, function (err) {
		if (err) {
			return handler(res)(err);;
		}

		// create new product and add it to database
		var product = req.body.productInfo;

		var newProduct = {
			title: product.productName,
			price: product.productPrice,
			stock: product.productAmount,
			description: product.productDescription,
			imageUrl: "images/products/" + req.file.filename,
			category: product.productCategory
		};

		Product.create(newProduct, handler(res));
	});

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

exports.getByCategoryId = function (req, res) {

	var catId = req.params.id;
	var categories = [];

	// get all child categories from cache memory
	cache.get('categoriesDoc', function (err, cats) {

		if (err) {
			return handler(res)(err);
		}

		categories = cats.filter(function (obj) {
			return obj.ancestors.indexOf(catId) != -1;
		});

		categories.push(catId);

		Product.find({ category: { $in: categories } }, handler(res));

	});

};