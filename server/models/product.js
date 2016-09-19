'use strict';

var mongoose = require('mongoose');
var slugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;

var productSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 },
		stock: { type: Number, default: 1 },
		description: String,
		specifications: [{ type: String }],
		hot: Boolean,
		sale: Boolean,
		imageUrl: String,
		category: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
		rating: {
			count: { type: Number, default: 0 },
			value: { type: Number, default: 0 },
			average: { type: Number, min: 0, max: 5, default: 0 }
		}
	},
	{
		timestamps: true
	}
).index(
	{
		'title': 'text',
		'description': 'text'
	}
	);

productSchema.methods.addReview = function (review, cb) {

	var self = this;

	// set product id to this review
	review.product = self._id;

	// check if this user already has review for this product
	self.model('Review')
		.findOne({ product: review.product, user: review.user })
		.exec(function (err, rv) {
			if (rv) {
				var error = new Error("only one review is allowed for each product!");
				return cb(err);
			}

			// create new review in db
			self.model('Review').create(review).then(
				// review created
				function (review) {
					self.rating.count = self.rating.count + 1;
					self.rating.value = self.rating.value + review.rate;
					self.rating.average = self.rating.value / self.rating.count;
					// save this product 
					self.save().then(
						function (result) {
							cb(null, result);
						},
						function (err) {
							// since there is an error we'll delete the review
							review.remove(function () {
								cb(err);
							});
						}
					);
				},
				function (err) {
					cb(err);
				}
			);

		});

};

productSchema.plugin(slugs('title'));

module.exports = productSchema;