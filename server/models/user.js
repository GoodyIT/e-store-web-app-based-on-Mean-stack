'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, lowercase: true },
    oAuthId: String,
    oAuthToken: String,
    firstname: String,
    lastname: String,
    imageUrl: {
        type: String,
        default: 'images/users/male_user.png'
    },
    admin: {
        type: Boolean,
        default: false
    },
    cart: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        amount: { type: Number, default: 1, min: 1 }
    }]
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.addToCart = function (product, cb) {
    var self = this;

    // check if this product already exist in the user cart
    var cartItem = self.cart.find(value => value.product == product.product);
    // if product exist than just incress amount
    if (cartItem) {
        self.model('User')
            .findOneAndUpdate(
                { _id: self.id, 'cart._id': cartItem._id },
                { $set: { 'cart.$.amount': cartItem.amount + product.amount } },
                { safe: true, upsert: true, new: true }
            )
            .populate('cart.product')
            .exec(function (err, user) {
                cb(err, { cart: user.cart });
            });
    }
    else {
        self.model('User')
            .findByIdAndUpdate(
                self._id,
                { $push: { cart: product } },
                { safe: true, upsert: true, new: true }
            )
            .populate('cart.product')
            .exec(function (err, user) {
                cb(err, { cart: user.cart });
            });
    }
};

userSchema.methods.updateCart = function (cart, cb) {
    // user data
    var self = this;
    var oldCart = self.cart;
    
    // add "old cart/product amount" to the new cart.
    for (var i = 0; i < oldCart.length; i++) {
        var sameProduct = cart.find(value => value.product == oldCart[i].product);

        if (sameProduct) {
            sameProduct.amount += oldCart[i].amount; // incress amount 
            console.log(sameProduct);
        }
        else {
            cart.push(oldCart[i]);
        }
    }

    // save the new cart to the user and return it.
    self.model('User')
        .findByIdAndUpdate(
            self.id,
            { $set: { cart: cart } },
            { safe: true, upsert: true, new: true }
        )
        .populate('cart.product')
        .exec(function (err, user) {
            cb(err, { cart: user.cart });
        });
};

userSchema.virtual('fullName').get(function () {
    return this.firstname + ' ' + this.lastname;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = userSchema;