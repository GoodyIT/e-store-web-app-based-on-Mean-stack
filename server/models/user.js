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
    self.cart.push(product);
    self.save().then(
        function (result) {
            cb(null, result);
        },
        function (err) {
            cb(err);
        }
    );
};

userSchema.virtual('fullName').get(function () {
    return this.firstname + ' ' + this.lastname;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = userSchema;