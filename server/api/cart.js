'use strict';

var User = require('../models').User;
var handler = require('./handler');

exports.addToCart = function (req, res) {
	
	var userId = req.userData._id;
	var cartItems = req.body.cartItems;
	
	// check user id
	if (!userId || !cartItems) {
		var err = new Error('API: params error');
		return handler(res)(err);
	}

	// find user 
	User.findOne({ _id: userId }, function (err, user) {
		if (err) {
			return handler(res)(err);
		}
		
		user.addToCart(cartItems, handler(res));
	});
};

exports.getCart = function (req, res) {
	
	var userId = req.userData._id;

	// find user by id and return user cart 
	User.findOne({ _id: userId })
		.populate('cart.product')
		.exec(function (err, user) {
			handler(res)(err, { cart: user.cart });
		});

};

exports.updateCart = function (req, res) {
	
	var userId = req.userData._id;
	var cart = req.body.cart;

	if (!userId || !cart) {
		var err = new Error('API: params error - ');
		return handler(res)(err);
	}

	// find user 
	User.findOne({ _id: userId }, function (err, user) {
		if (err) {
			return handler(res)(err);
		}
		
		user.updateCart(cart, handler(res));
	});

};

exports.removeOne = function (req, res) {

	var userId = req.userData._id;
	var cartItemId = req.params.id;

	// find user 
	User.findOne({ _id: userId }, function (err, user) {
		if (err) {
			return handler(res)(err);
		}
		
		user.removeOneFromCart(cartItemId, handler(res));
	});
};