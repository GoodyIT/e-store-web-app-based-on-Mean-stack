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

		ctr.submit = function () {
			// check if the form is valid
			if (ctr.catForm.$valid) {
				// get parent category id if exist
				var parent;

				if (ctr.catParent) {
					parent = ctr.categoriesList.find(function (obj) {
						return obj.name === ctr.catParent;
					});
				}

				categories.add(ctr.catName, parent).then(
					function (result) {
						ctr.catName = "";
						ctr.catParent = "";
						ctr.catForm.$setPristine();
						ctr.successMsg = true;
						ctr.errorMsg = false;
					},
					function (err) {
						
						if (err.data.error.code === 11000) {
							ctr.message = "this category is already exist!";
						}
						else {
							ctr.message = err.data.message;
						}

						ctr.successMsg = false;
						ctr.errorMsg = true;
					}
				);
			}
		};

		$scope.adminCat = ctr;

	}
]);