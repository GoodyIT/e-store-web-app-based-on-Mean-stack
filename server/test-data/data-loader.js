'use strict';

var testData = require('./test-data.json');
var categoriesData = testData.categories;
var productsData = testData.products;
var usersData = testData.users;
var reviewsData = testData.reviews;

exports.loadCategories = function (Category, data, cb) {

    if (!data) {
        data = categoriesData;
    }

    Category.create(data, function (err, categories) {
        if (err) {
            return cb(err);
        }

        cb(null, categories);
    });

}

exports.loadProducts = function (Product, data, cb) {

    if (!data) {
        data = productsData;
    }

    Product.create(data, function (err, products) {

        if (err) {
            return cb(err);
        }

        cb(null, products);

    });

};

exports.loadReviews = function (Review, data, cb) {

    if (!data) {
        data = reviewsData;
    }

    Review.create(data, function (err, reviews) {

        if (err) {
            return cb(err);
        }

        cb(null, reviews);

    });

};

exports.loadUsers = function (User, data, cb) {

    // if no data provided then use local test data
    if (!data) {
        data = usersData;
    }


    // make sure the data is an array
    if (!Array.isArray(data)) {
        data = [data];
    }

    // returned users
    var users = [];
    
        // loop through users data
        for (var i = 0; i < data.length; i++) {
            var userInfo = data[i];
    
            // register this user
            User.register(
                new User({ _id: userInfo._id, username: userInfo.username }),
                userInfo.password,
                function (err, user) {
                    if (err) {
                        return cb(err);
                    }
    
                    user.firstname = userInfo.firstname || '';
                    user.lastname = userInfo.lastname || '';
                    user.email = userInfo.email || '';
    
                    user.save(function (err, user) {
                        if (err) {
                            cb(err);
                        }

                        users.push(user);
    
                        // if all users registered than invoke the callback
                        if (users.length === data.length) {
                            cb(null, users);
                        }
    
                    });
                }
            );
        }
    
};


exports.categoriesData = categoriesData;
exports.productsData = productsData;
exports.usersData = usersData;
exports.reviewsData = reviewsData;