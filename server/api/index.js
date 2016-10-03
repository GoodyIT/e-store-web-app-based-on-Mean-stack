'use strict';

var express = require('express');
var productApi = require('./product');
var categoryApi = require('./category');
var cartApi = require('./cart');
var verify = require('../authentication/verify');

var router = express.Router();

/** PRODUCT API */
router.route('/products')
	// get all product
	.get(productApi.getAll)          
	// ADMIN => add new product        
	.post(verify.admin, productApi.addNew);  

router.route('/products/reviews/:id')
	// get reviews for given product
	.get(productApi.getReviews)              
	// USER => post review for specific product
	.post(verify.user, productApi.addReview);	         

router.route('/products/search/:text')
	// search for products using product title 
	.get(productApi.search);

router.route('/products/category/:id')
	// get products by category id
	.get(productApi.getByCategoryId);

router.route('/products/:id')
	// get product by slug
	.get(productApi.getById)
	// ADMIN => update product
	.put(verify.admin, productApi.updateById)
	// ADMIN => delete product by id
	.delete(verify.admin, productApi.deleteById);


/** CATEGORIES API */
router.route('/categories')
	// get categories array
	.get(categoryApi.getAll)
	// ADMIN => add new category
	.post(verify.admin, categoryApi.addNew);


/** CART API */
router.route('/cart')
	// USER => get user cart by user id 
	.get(verify.user, cartApi.getCart)
	// USER => add item to cart 
	.post(verify.user, cartApi.addToCart)
	// USER => update user cart
	.put(verify.user, cartApi.updateCart);

router.route('/cart/:id')
	// USER => delete one product from user cart (:id => product id)
	.delete(verify.user, cartApi.removeOne);

module.exports = router;