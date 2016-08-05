var Category = require('../models').Category;

var categoriesDoc = [];
var categoriesTree = [];
var catTreeCount = 0;



// get categories as Documents "MongoDB style"
function getCatDoc(done) {
	categoriesDoc = [];
	categoriesTree = [];

	Category.find({}, function (err, cats) {
		if (err) throw err;

		// copy categories into new array "by value only no references"
		categoriesDoc = JSON.parse(JSON.stringify(cats));
		
		done(cats);
	});
}

// get categories as Data Tree "parent > children"
function getCatTree(done) {

	// get root categories.
	categoriesTree = categoriesDoc.filter(function (obj) {
		return obj.parent == undefined;
	});

	// loop through all roots and get their children
	for (var i = 0; i < categoriesTree.length; i++) {

		if (categoriesTree[i].children && categoriesTree[i].children.length > 0) {

			getChildren(categoriesTree[i]);

		}
	}
	done();
}

function getChildren(root) {
	for (var x = 0; x < root.children.length; x++) {
		var child = findChild(root.children[x]);
		root.children[x] = child;
		if (child.children.length > 0) {
			getChildren(child);
		}
	}
}

function findChild(id) {
	return categoriesDoc.filter(function (obj) {
		return obj._id.toString() === id.toString();
	})[0];
}

function checkLoaderState(done) {
	countCategories(categoriesTree);
	if (catTreeCount === categoriesDoc.length) {
		done();
	}
}


function countCategories(tree) {
	// get nodes count
	catTreeCount += tree.length;

	for (var i = 0; i < tree.length; i++) {
		if (tree[i].children.length > 0) {
			countCategories(tree[i]);
		}
	}
}

module.exports = function (cb) {
	// exec
	getCatDoc(function (cats) {
		var objs = {};
		if (cats.length > 0) {

			objs['categoriesDoc'] = cats;

			getCatTree(function () {

				objs['categoriesTree'] = categoriesTree;

				cb(null, objs);
			});

		}
		else {
			var err = new Error('no cached objects');
			cb(err);
		}


	});
};