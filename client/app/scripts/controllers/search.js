bluStore.controller('searchCtrl', ['$scope', '$stateParams', 'productsFactory',
	function ($scope, $stateParams, products) {
		'use strict';

		var ctr = this;

		products.search($stateParams.text).get(
			function (result) {
				ctr.searchTerm = result.data.length;
				console.log(result.data);
			},
			function (err) {
				console.log(err);
			}
		);

		$scope.searchCtrl = this;

	}
]);