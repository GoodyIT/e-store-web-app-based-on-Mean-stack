var NodeCache = require("node-cache");
var categoryCache = require('./category');

var cache = new NodeCache();

// main Cache Loader
function Load(obj, done) {
		
	obj(function (err, objs) {

		// if there's no loaded data objects then return nothing. 
		if (err) {
			return;
		}

		var params = [];
		var keys = [];

		// init 2 arrays with data objects and cache keys
		for (key in objs) {
			keys.push(key);
			params.push(objs[key]);
		}

		// look for old caching for those objects
		cache.mget(keys, function (err, value) {
			// delete any old cache if exist
			if (!err) {
				for (var i = 0; i < keys.length; i++) {
					cache.del(keys[i]);
				}
			}

			// now add new cache version with the given key`
			for (var i = 0; i < keys.length; i++) {
				cache.set(keys[i], params[i]);
			}



			if(done) done();
		});

	});

}



// set Refresh Cache methdos
cache.set('refreshCategories', function (done) {
	// init cache loaders
	Load(categoryCache, done);
});

cache.set('loadCache', function (done) {
	// Load cache
	Load(categoryCache, done);
});

module.exports = cache;