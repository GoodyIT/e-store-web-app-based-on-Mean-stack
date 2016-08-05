'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');

var handleResponse = tools.handleResponse;
var Product = tools.Product;                 // Product Mongo Model 
var productsData = dataLoader.productsData;  // local test data



describe('Product API', function () {

	it('can get all products', function (done) {

		// load all products from test data
		loadProducts(productsData, function (result) {

			var url = config.server.url + 'api/blu-store/products';

			var validator = ['title', 'price', 'description'];
			superagent.get(url).end(handleResponse(result, validator, done));

		});

	});

	it('can add new product', function (done) {

		var url = config.server.url + 'api/blu-store/products';

		superagent.post(url).send(productsData[0])
			.end(handleResponse(function () {
				Product.findOne({ title: productsData[0].title }, function (err, prod) {
					assert.isNotOk(err);
					assert.isOk(prod);
					assert.equal(prod.price, productsData[0].price);
					done();
				});
			}));

	});

	it('can get product by id', function (done) {

		var url = config.server.url + 'api/blu-store/products/';

		loadProducts(productsData[0], function (result) {
			url += result._id;
			var validator = ['_id'];
			superagent.get(url).end(handleResponse(result, validator, done));
		});

	});

	it('can delete product by id', function (done) {

		var url = config.server.url + 'api/blu-store/products/';

		loadProducts(productsData[0], function (result) {
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

		loadProducts(productsData[0], function (result) {
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

});

// load given products to database (products => data)
function loadProducts(data, done) {
	dataLoader.loadProducts(Product, data, function (err, products) {
		assert.isNotOk(err);
		assert.isOk(products);
		done(products);
	});
}