'use strict';

var config = require('../config');
var bluebird = require('bluebird');
var models = bluebird.promisifyAll(require('../models'));
var stripe = bluebird.promisifyAll(require("stripe")(config.COMMERCE.STRIPE_SEC_KEY));
var handler = require('./handler');
var Order = models.Order;
var User = models.User;

// add product/s to user cart
exports.addToCart = function (req, res) {

    var userId = req.userData._id;
    var cartItems = req.body.cartItems;

    // check user id
    if (!userId || !cartItems) {
        var err = new Error('API: params error');
        return handler(res)(err);
    }

    // find user 
    User.findOne({ _id: userId }, function (err, user) {
        if (err) {
            return handler(res)(err);
        }

        user.addToCart(cartItems, handler(res));
    });
};

// get user cart
exports.getCart = function (req, res) {

    var userId = req.userData._id;

    // find user by id and return user cart 
    User.findOne({ _id: userId })
        .populate('cart.product')
        .exec(function (err, user) {
            handler(res)(err, { cart: user.cart });
        });

};

// update user cart
exports.updateCart = function (req, res) {

    var userId = req.userData._id;
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

// remove one item from user cart ( amount = amount - 1 )
exports.removeOne = function (req, res) {

    var userId = req.userData._id;
    var cartItemId = req.params.id;

    // find user 
    User.findOne({ _id: userId }, function (err, user) {
        if (err) {
            return handler(res)(err);
        }

        user.removeOneFromCart(cartItemId, handler(res));
    });
};

// checkout user cart
exports.checkout = function (req, res) {

    // set params
    var userId = req.userData._id;
    var orderData = req.body.order;
    orderData.user = userId;

    // verify givin order data
    verifyOrderData(orderData)
        
        .then(function () {
            // select charge method
            return selectChargeMethod(orderData.payMethod);
        })
        
        .then(function (chargeMethod) {
            // now charge this customer using returned charge method
            return chargeMethod(orderData);
        })

        // charge success and returned with charge id 
        .then(function (chargeId) {
            orderData.transaction = chargeId;
            // add this order to db and clear user cart
            return addOrderToUser(orderData);
        })

        .then(function() {
            handler(res)(null, { state: true });
        })
        
        .catch(function(err) {
            // refund if transaction is exist 
            refundCharge(orderData, function () {
                handler(res)(err);
            });
        });

};

var addOrderToUser = bluebird.promisify(
    function (orderData, cb) {

        var newOrder = {
            user: orderData.user,
            items: orderData.items,
            shipment : {
                name: orderData.custName,
                phone: orderData.custPhone,
                address: orderData.custAddress
            },
            payment: {
                method: orderData.payMethod,
                transaction : orderData.transaction
            }
        };
        
        Order.createAsync(newOrder)
            
            .then(function (order) {

                // now find this user 
                return User.findOneAsync({ _id: orderData.user });

            })

            .then(function (user) {
                // clear and save user cart 
                user.cart = [];
                return user.saveAsync();
            })

            .then(function () {
                cb(null, true);
            })
            
            // on error
            .catch(cb);

    }
);



function getCartTotalPrice(items) {
    return items.map(value => value.amount * value.product.price).reduce((prev, curr) => prev + curr, 0);
}