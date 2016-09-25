bluStore.directive('bluCartDropdown', ['cartFactory', '$rootScope', 'EVENTS',
	function (cartFactory, $rootScope, EVENTS) {
		'use strict';

		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/cart-dropdown.html",
			scope: {},
			link: function (scope, element, attrs) {

				scope.cart = [];

				// on login or logout or user data changes 
				$rootScope.$watch('userInfo', function (userInfo) {
					if(userInfo) {
						scope.$broadcast(EVENTS.LOAD_CART);
					}
					else {
						scope.cart = [];
					}
				});

				// on update cart event
				scope.$on(EVENTS.UPDATE_CART, function (event, cart) {
					// check user is exist 
					if ($rootScope.userInfo) {
						cartFactory.updateCart($rootScope.userInfo.id, cart).then(
							function (result) {
								scope.cart = result.data.cart;
							},
							function (err) {
								console.log(err);
							}
						);
					}
				});

				scope.$on(EVENTS.LOAD_CART, function () {
					
					var userInfo = $rootScope.userInfo;
					
					// if user logged in
					if (userInfo) {
						cartFactory.getCart(userInfo.id).then(
							function (result) {
								// check if the local cart not empty
								if (scope.cart.length > 0) {
									// update user cart on server before view
									scope.$broadcast(EVENTS.UPDATE_CART, scope.cart);
								}
								
								// add user cart data
								scope.cart = result.data;
							},
							function (err) {
								if (err.data.error === 'no-data' && scope.cart.length > 0) {
									// update user cart on server before view
									scope.$broadcast(EVENTS.UPDATE_CART, scope.cart);
								}
								scope.cart = [];
							}
						);
					}
					// if user logged out or no user at all
					else {
						scope.cart = [];
					}
				});

				// on add to cart event
				scope.$on(EVENTS.ADD_TO_CART, function (event, product) {
					var cartItem = {};
					
				
					// user and product exist => add product to user cart
					if ($rootScope.userInfo && product) {
						// user logged in 
						cartItem = { product: product._id, amount: 1 };
						cartFactory.addProduct($rootScope.userInfo.id, cartItem).then(
							function (result) {
								scope.cart = result.data.cart;
							},
							function (err) {
								console.log(err);
							}
						);
					}
					// no user => add product to the local cart
					else if (!$rootScope.userInfo && product) {
						// no user so save to cookie
						// check if this product already exist in the cart
						var cartExItem = scope.cart.find(value => value.product._id === product._id);

						if (cartExItem) {
							cartExItem.amount++;
						}
						else {
							cartItem = {
								product: product,
								amount: 1
							};

							scope.cart.push(cartItem);
						}

					}

				});

			}
		};

	}
]);