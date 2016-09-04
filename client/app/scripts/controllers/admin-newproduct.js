bluStore.controller('adminNewProductCtrl', ['$scope', 'Upload', 'API',
	function ($scope, Upload, API) {
		'use strict';

		var ctr = this;
		
		//function to call on form submit
		ctr.submit = function () {
			//check if from is valid
			if (ctr.upload_form.file.$valid && ctr.file) {
				//call upload function
				ctr.upload(ctr.file);
			}
		};

		ctr.upload = function (file) {
			Upload.upload({
				url: API.ADD_PRODUCT,
				data: {
					file: file,
					productInfo: {
						productName: ctr.npName,
						productAmount: ctr.npAmount,
						productPrice: ctr.npPrice,
						productDescription: ctr.npDescription,
						productCategory: ctr.npCategory
					}
				}
			}).then(function (resp) {
				if (resp.data.state === true) {
					ctr.npName = "";
					ctr.npAmount = "";
					ctr.npPrice = "";
					ctr.npDescription = "";
					ctr.npCategory = "";
					ctr.file = "";
					ctr.progress = 0;
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