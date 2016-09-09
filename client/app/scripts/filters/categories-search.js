bluStore.filter('categoriesSearch', function () {
	'use strict';
	
	return function (input, fullList, text) {
		var output = [];
		
		if (text) {

			var search = new RegExp(text , "i");
			output = jQuery.map(fullList, function(value) {
				return value.name.match(search) ? value : null;
			});

			return output;
		}
		else {
			return input;
		}

	};
});