bluStore.controller('searchCtrl', ['$rootScope', '$scope', '$stateParams', 'productsFactory', '$filter',
	function ($rootScope, $scope, $stateParams, products, $filter) {
		'use strict';

		var ctr = this;
		ctr.searchTerm = $stateParams.text;

		products.search(ctr.searchTerm).get(
			function (result) {
				ctr.error = false;
				ctr.products = $filter('productsGrid')(result.data, 3);
				$rootScope.loadingState = 'none';
			},
			function (err) {
				ctr.error = true;
				$rootScope.loadingState = 'none';
			}
		);

		$scope.searchCtrl = this;

	}
]);