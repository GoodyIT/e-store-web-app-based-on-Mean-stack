'use strict';

var testData = require('./test-data.json');
var categoriesData = testData.categories;
var productsData = testData.products;
var usersData = testData.users;
var reviewsData = testData.reviews;
var tools = require('../test/test-tools');
var config = tools.config;
var url = config.server.url;
var superagent = require('superagent');

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


function loadUsers (User, data, cb) {

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
            new User({
                _id: userInfo._id,
                username: userInfo.username,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                cart: userInfo.cart
            }),
            userInfo.password,
            function (err, user) {
                if (err) {
                    return cb(err);
                }
                users.push(user);

                // if all users registered than invoke the callback
                if (users.length === data.length) {
                    cb(null, users);
                }
            }
        );
    }

};

function loginUser (User, user, cb) {
    
    var userInfo = user || usersData[0];

    loadUsers(User, userInfo, function (err) {
        if (err) {
            return cb(err);
        }
        // login this user to get the token
		superagent.post(url + 'users/login')
			.send({ username: userInfo.username, password: userInfo.password })
			.end(function (err, res) {
                if (err) {
                    return cb(err);
                }
                userInfo.token = res.body.token;

                // return normal user
                return cb(null, userInfo);
			});
    });
};

exports.loginAdmin = function (User, cb) {
    // load and login normal user
    loginUser(User, null, function (err, user) {
        if (err) {
            return cb(err);
        }
        // give this user admin permissions
        User.update({ _id: user._id }, { $set: { admin: true } }).exec(function (err) {
            if (err) {
                return cb(err);
            }
            // return admin user with token
            return cb(null, user);
        });
    });
};

function loadCollection (Model, data) {
    return new Promise(function (resolve, reject) {
        Modle.create(data, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(loadCollection, result);
        });
    });
}


exports.loadUsers = loadUsers;
exports.loginUser = loginUser;

exports.categoriesData = categoriesData;
exports.productsData = productsData;
exports.usersData = usersData;
exports.reviewsData = reviewsData;