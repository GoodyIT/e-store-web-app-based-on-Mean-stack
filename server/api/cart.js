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


/**
 * orderData = >
 * => cardToken (string): customer card token e.g from stripe api
 * => items (array): list of items to purchase 
 * => custName (string): customer name
 * => custPhone (string): customer phone
 * => custEmail (string): customer email
 * => custAddress (string): customer address
 * => payMethod (string): payment method to charge user  
 */
var verifyOrderData = bluebird.promisify(
    function (orderData, cb) {
        // check givin data
        if (!orderData.cardToken) return cb(new Error('stripe token not found!'));
        if (!orderData.items && orderData.items.length > 0) return cb(new Error('no items to purchase in your cart!'));
        if (!orderData.custName) return cb(new Error('customer name required!'));
        if (!orderData.custPhone) return cb(new Error('customer phone required!'));
        if (!orderData.custEmail) return cb(new Error('customer email required!'));
        if (!orderData.custAddress) return cb(new Error('customer address required!'));
        if (!orderData.payMethod) return cb(new Error('payment method not provided!'));
        cb(null, true);
    }
);

// return charge function that always takes orderData Object 
var selectChargeMethod = bluebird.promisify(
    function (method, cb) {
        if (method === 'stripe') return cb(null, stripeCharge);
        
        /** 
         * to add more methods in the future list em here and create 
         * charge function e.g paypalCharge(orderData, cb); => 
         * and returns charge token aka tranaction  
         */

        cb(new Error('payment method not supported!'));
    }
);

// charge customer using stripe api
var stripeCharge = bluebird.promisify(
    function (orderData, cb) {
        
        var amount = getCartTotalPrice(orderData.items) * 100;
        
        stripe.charges.create(
            {
                amount: amount,
                currency: 'usd',
                source: orderData.cardToken,
                description: 'Charge for ' + orderData.custEmail,
                // The email address to send this charge's receipt to.
                receipt_email: orderData.custEmail,
                // string displayed on customer's credit card statement
                statement_descriptor: 'BluStore statement'
            },
            function (err, charge) {
                // return any error otherwise return charge id 
                if (err) return cb(err);

                cb(null, charge.id);
            }
        );

    }
);

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

function refundCharge (orderData, cb) {
    var transaction = orderData.transaction;
    if (!transaction) {
        // no transactions yet
        return cb();
    }

    if (orderData.payMethod === 'stripe') {
        // stripe refund
        stripe.refunds.create(
            { charge: transaction },
            function (err, refund) {
                if (err) console.log(err);
                cb();
            }
        );
    }
    else {
        cb();
    }

}

function getCartTotalPrice(items) {
    return items.map(value => value.amount * value.product.price).reduce((prev, curr) => prev + curr, 0);
}