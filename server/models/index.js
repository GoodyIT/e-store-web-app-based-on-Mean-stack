'use strict';

var mongoose = require('mongoose');
var category = require('./category');
var product = require('./product');
var user = require('./user');
var review = require('./review');

module.exports = {
	Category: mongoose.model('Category', category),
	Review: mongoose.model('Review', review),
	Product: mongoose.model('Product', product),
	User: mongoose.model('User', user)
};