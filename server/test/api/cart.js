'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');
var stripe = require('stripe')(config.STRIPE_PUB_KEY);
var User = tools.User;

var handleResponse = tools.handleResponse;

describe('Cart API', function () {

	it('can get user cart', function (done) {
		tools.loadProducts(dataLoader.productsData, function (products) {     // load products
			dataLoader.loginUser(User, null, function (err, user) {

				assert.isNotOk(err);
				assert.isOk(user.token);

				var url = config.TEST.SERVER + 'api/blu-store/cart';

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
								assert.equal(res.body.data.cart.length, 1);
								assert.equal(res.body.data.cart[0].product._id, cartProduct.product);
								done();
							}));
					});
				});

			});
		});
	});

	it('can add product to cart', function (done) {
		tools.loadProducts(dataLoader.productsData, function (products) {     // load products
			dataLoader.loginUser(User, null, function (err, user) {

				assert.isNotOk(err);
				assert.isOk(user.token);

				var url = config.TEST.SERVER + 'api/blu-store/cart';

				// create item to add to user cart
				var cartProduct = {
					product: products[0]._id,
					amount: 5
				};

				// send post request to add this product to user cart
				superagent
					.post(url)
					.set('x-access-token', user.token)
					.send({ cartItems: cartProduct })
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

	it('can add multiple products to cart', function (done) {
		tools.loadProducts(dataLoader.productsData, function (products) {
			// load test user
			var testUser = dataLoader.usersData[3];
			dataLoader.loginUser(User, testUser, function (err, user) {
				assert.isNotOk(err);
				assert.isOk(user.token);

				var url = config.TEST.SERVER + 'api/blu-store/cart';
				var cartItems = [
					{
						product: "57db129b6681422c147bee5d",
						amount: 2,
					},
					{
						product: "57e9121eabc295cc048511f9",
						amount: 3,
					}
				];

				// send post request to add these products to user cart
				superagent
					.post(url)
					.set('x-access-token', user.token)
					.send({ cartItems: cartItems })
					.end(handleResponse(function (err, res) {
						assert.isNotOk(err);
						assert.isOk(res.body.data.cart);
						var cart = res.body.data.cart;
						assert.equal(cart.length, 3);
						assert.equal(cart[0].amount, 4);
						assert.equal(cart[2].amount, 3);
						done();
					}));
			});
		});
	});

	it('can delete one product from user cart', function (done) {
		tools.loadProducts(dataLoader.productsData, function (products) {
			// load test user
			var testUser = dataLoader.usersData[3];
			dataLoader.loginUser(User, testUser, function (err, user) {
				assert.isNotOk(err);
				assert.isOk(user.token);

				var url = config.TEST.SERVER + 'api/blu-store/cart/' + testUser.cart[0]._id;

				superagent
					.del(url)
					.set('x-access-token', user.token)
					.end(function (err, res) {
						assert.isNotOk(err);
						var cartData = res.body.data.cart;
						assert.isOk(cartData);
						assert.equal(cartData[0].amount, 1);

						superagent
							.del(url)
							.set('x-access-token', user.token)
							.end(function (err, res) {
								assert.isNotOk(err);
								var cartData = res.body.data.cart;
								assert.isOk(cartData);
								assert.equal(cartData.length, 1);
								assert.equal(cartData[0].product._id, testUser.cart[1].product);
								done();
							});
					});

			});
		});
	});

	it('can update user cart', function (done) {
		tools.loadProducts(dataLoader.productsData, function (products) {     // load products
			var testUser = dataLoader.usersData[3];
			dataLoader.loginUser(User, testUser, function (err, user) {

				assert.isNotOk(err);
				assert.isOk(user.token);

				// change user cart
				user.cart[0].product = "57e0f690d20d779c024ebad0";
				user.cart[0].amount = "3";
				user.cart[1].amount = "30";

				var url = config.TEST.SERVER + 'api/blu-store/cart';

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

	it('can checkout user cart', function (done) {
		
		// stripe api takes long to return token so adjust timeout 
		this.timeout(10000);

		var testUser = dataLoader.usersData[3];
		dataLoader.loginUser(User, testUser, function (err, user) {
			
			var order = {
				items: [
					{
						product: dataLoader.productsData[0],
						amount: 3
					},
					{
						product: dataLoader.productsData[1],
						amount: 20
					}
				],
				custName: 'Ahmed Ali',
				custPhone: '+201018016247',
				custAddress: 'mansoura, egypt',
				custEmail: 'contact@ahmedali.me'
			};

			stripe.tokens.create({
				card: {
					number: '4242424242424242',
					exp_month: 12,
					exp_year: 2017,
					cvc: '123',
					name: 'Ahmed Ali'
				}
			}, function (err, token) {
				assert.isNotOk(err);
				assert.isOk(token);
				assert.isOk(token.id);

				// append given token to the order
				order.payMethod = 'stripe';
				order.cardToken = token.id;

				var url = config.TEST.SERVER + 'api/blu-store/cart/checkout';

				superagent
					.post(url)
					.set('x-access-token', user.token)
					.send({ order: order })
					.end(done);

			});

		});
	});

});