'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');
var fs = require('fs');

var handleResponse = tools.handleResponse;
var Product = tools.Product;                 // Product Mongo Model 
var Category = tools.Category;
var User = tools.User;
var Review = tools.Review;
var productsData = dataLoader.productsData;  // local test data
var usersData = dataLoader.usersData;
var categoriesData = dataLoader.categoriesData;
var reviewsData = dataLoader.reviewsData;

describe('Product API', function () {

	it('can get all products', function (done) {

		// load all products from test data
		tools.loadProducts(productsData, function (result) {

			var url = config.server.url + 'api/blu-store/products';

			var validator = ['title', 'price', 'description'];
			superagent.get(url).end(handleResponse(result, validator, done));

		});

	});

	it('can add new product');

	it('can get product by slug', function (done) {

		var url = config.server.url + 'api/blu-store/products/';

		tools.loadProducts(productsData[0], function (result) {
			url += result.slug;
			var validator = ['_id'];
			superagent.get(url).end(handleResponse(result, validator, done));
		});

	});

	it('can delete product by id', function (done) {

		var url = config.server.url + 'api/blu-store/products/';

		tools.loadProducts(productsData[0], function (result) {
			url += result._id;

			superagent.del(url).end(function () {
				// make sure this product is no longer in the db
				Product.findOne({ _id: result._id }, function (err, prod) {
					assert.isNotOk(err);
					assert.isNotOk(prod);
					done();
				});
			});
		});

	});

	it('can update item by id', function (done) {

		tools.loadProducts(productsData[0], function (result) {
			var url = config.server.url + 'api/blu-store/products/';
			url += result._id;
			// create new title to update the product 
			var newTitle = "new title test";
			// edit product without saving to database
			result.title = newTitle;
			var validator = ['title'];
			superagent.put(url).send(result).end(handleResponse(result, validator, done));
		});

	});

	it('can add review to product', function (done) {
		// load product to db for testing
		tools.loadProducts(productsData[0], function (product) {
			// load user to db for testing
			tools.loadUsers(usersData[0], function (user) {
				// send add review request
				var url = config.server.url + 'api/blu-store/products/reviews/' + product._id;
				var review = {
					user: user[0]._id,
					comment: "this is a comment on this product",
					rate: 5
				};
				superagent.post(url).send({ review: review }).end(handleResponse(function (err, res) {
					assert.isNotOk(err);
					assert.isOk(res.body.data);
					assert.equal(res.body.data.rating.count, 1);
					assert.equal(res.body.data.rating.value, 5);
					// new review 
					review.rate = 1;
					superagent.post(url).send({ review: review }).end(handleResponse(function (err, res) {
						assert.equal(res.body.data.rating.count, 2);
						assert.equal(res.body.data.rating.value, 6);
						assert.equal(res.body.data.rating.average, 3);	
						done();
					}));
				}));
			})
		});
	});

	it('can search products by title', function (done) {
		// load products to db
		tools.loadProducts(productsData, function(products) {
			// search for iphone 
			var url = config.server.url + 'api/blu-store/products/search/iphone';
			superagent.get(url).end(function (err, result) {
				assert.isNotOk(err);
				assert.isOk(result.body.data);
				assert.equal(result.body.data.length, 2);
				done();
			});
		});
	});

	it('can get products by category id', function (done) {
		// load categories data 
		tools.loadCategories(categoriesData, function (categories) {
			// load product data
			tools.loadProducts(productsData, function (products) {
				var cateSearch = categories[0]._id;
				// send search request
				var url = config.server.url + 'api/blu-store/products/category/' + cateSearch;
				superagent.get(url).end(function (err, result) {
					assert.isNotOk(err);
					assert.isOk(result.body.data);
					assert.equal(result.body.data.length, 4);
					done();
				});
			});
		});
	});

	it("can get product's reviews", function (done) {
		// load categories data 
		tools.loadCategories(categoriesData, function (categories) {
			// load product data
			tools.loadProducts(productsData, function (products) {
				// load reviews
				tools.loadReviews(reviewsData, function (reviews) {
					var testProduct = productsData[5];
					var url = config.server.url + 'api/blu-store/products/reviews/' + testProduct._id;
					superagent.get(url).end(function (err, result) {
						assert.isNotOk(err);
						assert.isOk(result.body.data);
						assert.equal(result.body.data.length, 3); // returned with 3 reviews
						done();
					});
				});
			});
		});
	});

});