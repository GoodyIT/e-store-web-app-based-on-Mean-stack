bluStore.controller('searchCtrl', ['$scope', '$stateParams', 'productsFactory', '$filter',
	function ($scope, $stateParams, products, $filter) {
		'use strict';

		var ctr = this;
		ctr.searchTerm = $stateParams.text;

		products.search(ctr.searchTerm).get(
			function (result) {
				ctr.error = false;
				ctr.products = $filter('productsGrid')(result.data, 3);
			},
			function (err) {
				ctr.error = true;
			}
		);

		$scope.searchCtrl = this;

	}
]);