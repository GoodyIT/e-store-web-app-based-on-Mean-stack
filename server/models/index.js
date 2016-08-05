'use strict';

var mongoose = require('mongoose');
var category = require('./category');
var product = require('./product');
var user = require('./user');

module.exports = {
	Category: mongoose.model('Category', category),
	Product: mongoose.model('Product', product),
	User: mongoose.model('user', user)
};