'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, lowercase: true },
    oAuthId: String,
    oAuthToken: String,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: 'images/users/male_user.png'
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

userSchema.virtual('fullName').get(function () {
    return this.firstname + ' ' + this.lastname;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = userSchema;