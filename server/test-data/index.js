'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var config = require('../config');
var colors = require('colors/safe');
mongoose.Promise = require('bluebird');

var dataLoader = require('./data-Loader');

var arg = process.argv[2];

var models;
var Category;
var Product;
var User;
var Review;

// connnect to database
mongoose.connect(config.MONGODB);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log(err);
});

db.once('open', function () {

    models = require('../models');
    Category = models.Category;
    Product = models.Product;
    User = models.User;
    Review = models.Review;

    if (arg === 'load') {
        loadData();
    }
    else if (arg === 'clear') {
        clearData(function () {
            process.exit(1);
        });
    }
    else {
        clearData(function () {
            loadData();
        });
    }

});

function loadData() {
    // load Categories
    dataLoader.loadCategories(Category, null, function (err, categories) {

        if (err) {
            console.log(err);
        }

        var num = colors.yellow.bold('\n\t' + categories.length);
        var msg = colors.green.bold(' - Categories Loaded to Database!\n');
        console.log(num + msg);

        dataLoader.loadProducts(Product, null, function (err, products) {

            if (err) {
                console.log(err);
            }

            var num = colors.yellow.bold('\n\t' + products.length);
            var msg = colors.green.bold(' - Products Loaded to Database!\n');
            console.log(num + msg);

            dataLoader.loadReviews(Review, null, function (err, reviews) {

                if (err) {
                    console.log(err);
                }

                var num = colors.yellow.bold('\n\t' + reviews.length);
                var msg = colors.green.bold(' - Reviews Loaded to Database!\n');
                console.log(num + msg);

                dataLoader.loadUsers(User, null, function (err, users) {
                    if (err) {
                        console.log(err);
                    }

                    var num = colors.yellow.bold('\n\t' + users.length);
                    var msg = colors.green.bold(' - Users Loaded to Database!\n');
                    console.log(num + msg);

                    db.close();

                });

            });

        });

    });
}



function clearData(done) {

    deleteCollection(Category)
        .then(function (fn, err) {
            if (err) throw err;
            console.log(colors.red.bold('\n\t* categories db cleaned!\n'));
            return fn(Product);
        })
        .then(function (fn) {
            console.log(colors.red.bold('\n\t* products db cleaned!\n'));
            return fn(Review);
        })
        .then(function (fn) {
            console.log(colors.red.bold('\n\t* reviews db cleaned!\n'));
            return fn(User);
        })
        .then(function () {
            console.log(colors.red.bold('\n\t* users db cleaned!\n'));
            done();
        });

}


function deleteCollection(model) {
    return new Promise(function (resolve, reject) {

        model.remove({}, function (err) {
            if (err) {
                reject(err);
            }

            resolve(deleteCollection);
        });

    });
}