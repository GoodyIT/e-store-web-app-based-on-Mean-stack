bluStore.directive('bluCartDropdown', ['cartFactory', '$rootScope', 'EVENTS', 'CONFIG', 'localStorageFactory',
	function (cartFactory, $rootScope, EVENTS, CONFIG, localStorage) {
		'use strict';

		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/cart-dropdown.html",
			scope: {},
			link: function (scope, element, attrs) {

				// prevent the menu from close on click
				$('#cart-dropdown-scroll').on('click', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});

				// on any cart changes reflect that on this cart
				scope.$on(EVENTS.CART_CHANGED, function (event, newCart) {
					scope.cart = newCart;
				});

				// load the cart on user login or logout
				$rootScope.$watch('userInfo', function (userInfo) {
					// user logged in
					if (userInfo) {
						// load user cart
						cartFactory.userCart.get();
					}
					// user logged out
					else {
						// load local cart 
						cartFactory.localCart.get();
					}
				});

				// recive any add product to cart request on this event
				scope.$on(EVENTS.ADD_TO_CART, function (event, product, amount) {
					addProduct(product, amount || 1);
				});

				function addProduct(product, amount) {

					var userInfo = $rootScope.userInfo;

					var cartItem = {
						product: product,
						amount: amount
					};

					if (userInfo) {
						cartFactory.userCart.add(cartItem);
					}
					else {
						cartFactory.localCart.add(cartItem);
					}

				}

				scope.$on(EVENTS.REMOVE_FROM_CART, function (event, item) {
					var userInfo = $rootScope.userInfo;

					if (userInfo) {
						cartFactory.userCart.remove(item._id);
					}
					else {
						cartFactory.localCart.remove(item.product._id);
					}

				});

				scope.$on(EVENTS.UPDATE_CART, function (event, cart) {
					var userInfo = $rootScope.userInfo;

					if (userInfo) {
						cartFactory.userCart.update(cart);
					}
					else {
						cartFactory.localCart.update(cart);
					}
				});

				scope.removeOne = function (item) {
					$rootScope.$broadcast(EVENTS.REMOVE_FROM_CART, item);
				};

				scope.getTotalAmount = cartFactory.getTotalAmount;

			}
		};

	}
]);