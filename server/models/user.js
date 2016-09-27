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

userSchema.methods.addToCart = function (items, cb) {
    var self = this;

    // add give items to user cart
    if (Array.isArray(items)) {
        // handle products Array
        for (var i = 0; i < items.length; i++) {
            self.addProductToCart(items[i]); // add this item to user cart 
        }

    }
    else {
        self.addProductToCart(items); // add this item to user cart 
    }

    // update user cart and return new data
    self.updateCart(self.cart, cb);

};

userSchema.methods.addProductToCart = function (item) {
    
    var cart = this.cart;
    
    if (!cart || !item) {
        return null;
    } 

    var cartItem = cart.find(value => value.product == item.product);

    if (cartItem) {
        cartItem.amount += item.amount;
    }
    else {
        cart.push(item);
    }

    return cart;

};

userSchema.methods.removeOneFromCart = function (cartItemId, cb) {
    var self = this;

    var cartItem = self.cart.id(cartItemId);

    if (cartItem.amount > 1) {
        cartItem.amount--;
    }
    else {
        cartItem.remove();
    }

    // save changes and return new result
    self.updateCart(self.cart, cb);

};

userSchema.methods.updateCart = function (cart, cb) {
    // user data
    var self = this;

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