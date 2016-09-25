'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');
var User = tools.User;

var handleResponse = tools.handleResponse;

describe('Cart API', function () {

	it('can get user cart', function (done) {

		tools.loadCategories(dataLoader.categoriesData, function (categories) {   // load categories 
			tools.loadProducts(dataLoader.productsData, function (products) {     // load products
				dataLoader.loginUser(User, null, function (err, user) {

					assert.isNotOk(err);
					assert.isOk(user.token);

					var url = config.server.url + 'api/blu-store/cart/' + user._id;

					// create item to add to user cart
					var cartProduct = {
						product: products[0]._id,
						amount: 5
					};

					User.findOne({ _id: user._id }, function (err, dbUser) {
						// add cart item to db user 
						dbUser.addToCart(cartProduct, function (err, result) {
							assert.isNotOk(err);
							assert.isOk(result);

							superagent.get(url)
								.set('x-access-token', user.token)
								.end(handleResponse(function (err, res) {
									assert.isNotOk(err);
									assert.isOk(res.body.data);
									assert.equal(res.body.data.length, 1);
									assert.equal(res.body.data[0].product._id, cartProduct.product);
									done();
								}));
						});
					});

				});
			});
		});

	});

	it('can add product to cart', function (done) {

		tools.loadCategories(dataLoader.categoriesData, function (categories) {   // load categories 
			tools.loadProducts(dataLoader.productsData, function (products) {     // load products
				dataLoader.loginUser(User, null, function (err, user) {

					assert.isNotOk(err);
					assert.isOk(user.token);

					var url = config.server.url + 'api/blu-store/cart/' + user._id;

					// create item to add to user cart
					var cartProduct = {
						product: products[0]._id,
						amount: 5
					};

					// add cart item to local user for testing with incoming result
					user.cart = [cartProduct];

					// send post request to add this product to user cart
					superagent
						.post(url)
						.set('x-access-token', user.token)
						.send({ product: cartProduct })
						.end(handleResponse(function (err, res) {
							assert.isNotOk(err);
							assert.isOk(res.body.data.cart);
							var cart = res.body.data.cart;
							assert.equal(cart.length, 1);
							assert.equal(cart[0].product._id, cartProduct.product);
							assert.equal(cart[0].amount, cartProduct.amount);
							done();
						}));
				});
			});
		});

	});

	it('can update user cart', function (done) {
		tools.loadCategories(dataLoader.categoriesData, function (categories) {   // load categories 
			tools.loadProducts(dataLoader.productsData, function (products) {     // load products
				var testUser = dataLoader.usersData[3];
				dataLoader.loginUser(User, testUser, function (err, user) {
					
					assert.isNotOk(err);
					assert.isOk(user.token);

					// change user cart
					user.cart[0].product = "57e0f690d20d779c024ebad0";
					user.cart[0].amount = "3";
					user.cart[1].amount = "30";
					
					var url = config.server.url + 'api/blu-store/cart/' + user._id;

					superagent
						.put(url)
						.set('x-access-token', user.token)
						.send({ cart: user.cart })  // send updated cart
						.end(function (err, res) {
							assert.isNotOk(err);
							var cartData = res.body.data.cart; 
							assert.isOk(cartData);
							assert.equal(cartData[0].product._id, user.cart[0].product);
							assert.equal(cartData[0].amount, user.cart[0].amount);
							assert.equal(cartData[1].product._id, user.cart[1].product);
							assert.equal(cartData[1].amount, user.cart[1].amount);
							done();
						});

				});
			});
		});
	});

});