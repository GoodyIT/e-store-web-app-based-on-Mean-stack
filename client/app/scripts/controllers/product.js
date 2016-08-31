bluStore.controller('productCtrl', ['$scope', 'productsFactory', '$stateParams',
	function($scope, products, $stateParams){

		products.getById($stateParams.id).get(function(result){
			$scope.product = result.data;
		});

	}
]);