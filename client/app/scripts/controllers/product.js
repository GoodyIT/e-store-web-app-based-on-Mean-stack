bluStore.controller('productCtrl', ['$scope', '$rootScope', 'productsFactory', '$stateParams',
	function($scope, $rootScope, products, $stateParams){

		products.getById($stateParams.id).get(function(result){
			$scope.product = result.data;
		});

	}
]);