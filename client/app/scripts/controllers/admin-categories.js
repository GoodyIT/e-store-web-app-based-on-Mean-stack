bluStore.controller('adminCategories', ['$scope','categoriesFactory',
	function ($scope, categories) {
		'use strict';

		var ctr = this;
		ctr.categoriesList = [];
		ctr.catName = "";

		// get all categories and set them to the scope
        categories.getAll('doc').get(function(result){
            ctr.categoriesList = result.data;
        });

		// return true if input category is already in the categories list 
		ctr.checkCategory = function () {
			return ctr.categoriesList.find(function (obj) {
				try {
					return obj.name.toLowerCase() === ctr.catName.toLowerCase();
				}
				catch (e){
					return false;
				}
			});
		};


		$scope.adminCat = ctr;

	}
]);