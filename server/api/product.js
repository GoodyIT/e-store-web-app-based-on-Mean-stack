'use strict';

var Product = require('../models').Product;
var handler = require('./handler');
var cache = require('../data-memory');
var multer = require('multer');
var fs = require('fs');

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
			return handler(res)(err);
		}

		// create new product and add it to database
		var product = req.body.productInfo;

		var newProduct = {
			title: product.name,
			price: product.price,
			stock: product.amount,
			sale: product.sale,
			hot: product.hot,
			specifications: product.specifications,
			description: product.description,
			imageUrl: "images/products/" + req.file.filename,
			category: product.category
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
	Product.findByIdAndRemove({ _id: req.params.id }, function (error, product) {
		// delete product image 
		var imageUrl = product.imageUrl;

		// check if the product image is exist 
		fs.stat('server/public/' + imageUrl, function (err, stats) {
			if(!err) {
				// delete the image
				fs.unlink('server/public/' + imageUrl, function (err) {
					handler(res)(error, product); // send response back
				});
			}
			else {
				handler(res)(error, product); // send response back
			}
		});
	});
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