bluStore.directive('bluCartDropdown', ['cartFactory', '$rootScope',
	function (cartFactory, $rootScope) {
		'use strict';

		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/cart-dropdown.html",
			scope: {},
			link: function (scope, element, attrs) {

				$rootScope.$watch('userInfo', function (userInfo) {
					if (userInfo) {
						cartFactory.getCart(userInfo.id).then(
							function (result) {
								scope.cart = result.data;
							},
							function (err) {
								console.log(err);
							}
						);
					}
					else {
						scope.cart = null;
					}
				});

			}
		};

	}
]);