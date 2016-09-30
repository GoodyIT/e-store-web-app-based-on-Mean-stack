bluStore.directive('bluCartDropdown', ['cartFactory', '$rootScope', 'EVENTS', 'CONFIG', 'localStorageFactory',
	function (cartFactory, $rootScope, EVENTS, CONFIG, localStorage) {
		'use strict';

		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/cart-dropdown.html",
			link: function (scope, element, attrs) {
				// prevent the menu from close on click
				$('.cart-dropdown').on('click', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});
			}
		};

	}
]);