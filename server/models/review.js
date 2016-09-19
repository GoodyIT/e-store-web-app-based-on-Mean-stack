'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewsSchema = new Schema(
	{
		product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		comment: { type: String, required: true },
		rate: { type: Number, min: 0, max: 5, required: true }
	},
	{
		timestamps: true
	}
);

module.exports = reviewsSchema;