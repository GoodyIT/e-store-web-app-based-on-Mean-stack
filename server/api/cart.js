'use strict';

var User = require('../models').User;
var handler = require('./handler');

exports.addToCart = function (req, res) {
	
	var userId = req.params.id;
	var product = req.body.product;
	
	// check user id
	if (!userId || !product) {
		var err = new Error('API: params error');
		return handler(res)(err);
	}

	// find user 
	User.findOne({ _id: userId }, function (err, user) {
		if (err) {
			return handler(res)(err);
		}
		
		user.addToCart(product, handler(res));
	});
};

exports.getCart = function (req, res) {
	
	var userId = req.params.id;

	// find user by id and return user cart 
	User.findOne({ _id: userId })
		.populate('cart.product')
		.exec(function (err, user) {
			handler(res)(err, user.cart);
		});

};

exports.updateCart = function (req, res) {
	var userId = req.params.id;
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