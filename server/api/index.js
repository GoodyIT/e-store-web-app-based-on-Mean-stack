'use strict';

var express = require('express');
var productApi = require('./product');
var categoryApi = require('./category');

var router = express.Router();

router.route('/products')
	.get(productApi.getAll)
	.post(productApi.addNew);

router.route('/products/:id')
	.get(productApi.getById)
	.put(productApi.updateById)
	.delete(productApi.deleteById);

router.route('/categories')
	.get(categoryApi.getAll)
	.post(categoryApi.addNew);

router.route('/categories/:id')
	.get(categoryApi.getById);

module.exports = router;