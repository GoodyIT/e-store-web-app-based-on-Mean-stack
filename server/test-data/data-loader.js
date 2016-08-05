'use strict';

var testData = require('./test-data.json');
var categoriesData = testData.categories;
var productsData = testData.products;

exports.loadCategories = function (Category, data, cb) {

    if(!data){
        data = categoriesData;
    }

    Category.create(data, function(err, categories){
        if (err){
            return cb(err);
        }

        cb(null, categories);
    });

}

exports.loadProducts = function(Product, data, cb){

    if(!data){
        data = productsData;
    }

    Product.create(data, function(err, products) {
        
        if(err) { 
            return cb(err);
        }

        cb(null, products);

    });

}

exports.categoriesData = categoriesData;
exports.productsData = productsData;