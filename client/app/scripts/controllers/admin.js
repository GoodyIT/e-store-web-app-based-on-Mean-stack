bluStore.controller('adminCtrl', ['$rootScope', '$scope',
	function ($rootScope, $scope) {
		'use strict';

		var that = this;

		// on view content loaded 
		$scope.$on('$viewContentLoaded', function (event) {
			// hide loading icon and show content
			$rootScope.stateLoading.app = false;
		});

		$scope.$on('$stateChangeSuccess', function(event, toState) {
			if (toState.name === "app.admin.newproduct") {
				that.activeView = "newproduct";
			}
			else if (toState.name === "app.admin.orders") {
				that.activeView = "orders";
			}
		});

		$scope.adminScope = this;

	}
]);