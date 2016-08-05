'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	title: { type: String, required: true, trim: true },
	price: { type: Number, required: true, min: 0 },
	stock: { type: Number, default: 1 },
	description: String,
	imageUrl: String,
	categories: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }]
},
{
	timestamps: true
}).index({
	'title': 'text',
	'description': 'text'
});

module.exports = productSchema;