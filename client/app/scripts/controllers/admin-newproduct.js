bluStore.controller('adminNewProductCtrl', ['$scope', 'Upload', 'API', 'categoriesFactory',
	function ($scope, Upload, API, categories) {
		'use strict';

		var ctr = this;
		
		// get all categories and set them to the scope
        categories.getAll('doc').get(function(result){
            ctr.categoriesList = result.data;
        });

		//function to call on form submit
		ctr.submit = function () {
			//check if from is valid
			if (ctr.up.file.$valid && ctr.file) {
				//call upload function
				ctr.upload(ctr.file);
			}
		};

		ctr.upload = function (file) {
			// get category by selected name
			var category = ctr.categoriesList.find(function (obj) {
				return obj.name === ctr.npCategory;
			});

			// upload new product data to server 
			Upload.upload({
				url: API.ADD_PRODUCT,
				data: {
					file: file,
					productInfo: {
						name: ctr.npName,
						amount: ctr.npAmount,
						price: ctr.npPrice,
						sale: ctr.npSale,
						hot: ctr.npHot,
						specifications: ctr.npSpecs.split('\n'),
						description: ctr.npDescription,
						category: category._id
					}
				}
			}).then(function (resp) {
				if (resp.data.state === true) {
					ctr.npName = "";
					ctr.npAmount = "";
					ctr.npPrice = "";
					ctr.npSpecs = "";
					ctr.npDescription = "";
					ctr.npCategory = "";
					ctr.file = "";
					ctr.progress = 0;
					ctr.up.$setPristine();
				}
				else {
					// upload failed
				}
			},
				function (resp) {
					// error
				},
				function (evt) {
					// capture upload progress
					ctr.progress = parseInt(100.0 * evt.loaded / evt.total);
				});
		};

		$scope.adminNp = this;

	}
]);