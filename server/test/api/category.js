'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');
var cache = require('../../data-memory');

var Category = tools.Category;
var categoriesData = dataLoader.categoriesData;
var handleResponse = tools.handleResponse;
var counter = 0;

describe('Category API', function () {

	it('can get all categories from cache memory as db documents', function (done) {
		// load local categories test data to server database 
		loadCategories(categoriesData, function (result) {

			var url = config.server.url + 'api/blu-store/categories?format=doc';

			// load cache
			cache.get('loadCache')(function () {

				// send get request to get all categories as a tree from cache memory
				superagent.get(url).end(handleResponse(function (res) {
					assert.equal(res.body.data.length, result.length);
					done();
				}));

			});

		});

	});

	it('can get all categories from cache memory as a Tree', function (done) {

		loadCategories(categoriesData, function (result) {
			var url = config.server.url + 'api/blu-store/categories?format=tree';

			// load cache
			cache.get('loadCache')(function () {

				superagent.get(url).end(handleResponse(function (res) {
					// set the counter to 0
					counter = 0;
					// count categories in the tree
					validateCatTree(res.body.data);
					// compare with db data length
					assert.equal(counter, result.length);
					done();
				}));

			});

		});

	});

	it('can get category by id', function (done) {

		// load all categories
		loadCategories(categoriesData, function (result) {

			cache.get('loadCache')(function () {

				var url = config.server.url + 'api/blu-store/categories/' + result[0]._id;

				superagent.get(url).end(handleResponse(result[0], ['name'], done));

			});

		});

	});

	it('can add new category', function (done) {

		// load all categories to db
		loadCategories(categoriesData, function (result) {
			// load server cache
			cache.get('loadCache')(function () {

				var catObj = {
					name: "just another category 0909",
					parent: result[0]._id
				};

				var url = config.server.url + 'api/blu-store/categories';

				// send add category request to the server 
				superagent.post(url).send(catObj).end(handleResponse(function (res) {

					// validate the new category into db 
					Category.findOne({ name: catObj.name })
						.populate('parent')
						.exec(function (err, cat) {
							assert.isNotOk(err);
							assert.isOk(cat);
							assert.equal(cat.parent.name, result[0].name);
							assert.equal(cat.ancestors.length, result[0].ancestors);
							
							// validate the new category into server caching
							url += '/' + cat._id;
							// get category by id
							var validator = ['name'];

							superagent.get(url).end(handleResponse(cat, validator, done));

						});

				}));

			});
		});

	});


});


function loadCategories(data, done) {
	dataLoader.loadCategories(Category, data, function (err, categories) {
		assert.isNotOk(err);
		assert.isOk(categories);
		done(categories);
	});
}


function validateCatTree(tree) {

	if (tree.children) {
		// it's a Tree count it and return, than get children
		counter++;

		if (tree.children.length) {
			for (var i = 0; i < tree.children.length; i++) {
				validateCatTree(tree.children[i]);
			}
		}
	}
	else {
		// if there's more than one tree loop them
		if (Array.isArray(tree)) {
			for (var i = 0; i < tree.length; i++) {
				validateCatTree(tree[i]);
			}
		}
	}
}
