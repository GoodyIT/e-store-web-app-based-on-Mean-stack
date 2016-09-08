'use strict';

var mongoose = require('mongoose');
var slugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: { type: String, required: true, unique: true },
	slug: { type: String },
	parent: { type: Schema.Types.ObjectId, ref: 'Category' },
	ancestors: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	children: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

categorySchema.methods = {
	addChild: function (child, cb) {
		var self = this;

		child.parent = self._id;
		child.ancestors = self.ancestors.concat([self._id]);

		return self.model('Category').create(child).then(function (child) {
			self.children.push(child._id);
			self.save().then(
				function(result){
					cb(null, result);
				},
				function (error){
					cb(error, null);
				}
			);
		});
	}
};

categorySchema.plugin(slugs('name'));

module.exports = categorySchema;


