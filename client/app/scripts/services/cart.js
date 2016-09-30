bluStore.factory('cartFactory', function ($resource, API) {
	'use strict';

	return {

		getCart: function (userId) {
			return $resource(API.GET_CART, { id: userId }).get().$promise;
		},

		addProduct: function (userId, cartItems) {
			return $resource(API.ADD_TO_CART, { id: userId })
				.save({}, { cartItems: cartItems }).$promise;
		},

		updateCart: function (userId, cart) {
			return $resource(API.UPDATE_CART, { id: userId }, { 'update': { method: 'PUT' } })
				.update(userId, { cart: cart }).$promise;
		},

		delOneFromCart: function (cartItemId) {
			return $resource(API.DEL_ONE_FROM_CART, { id: cartItemId }).remove().$promise;
		},

		getTotalAmount: function (cart) {
            return cart.map(value => value.amount).reduce((prev, curr) => prev + curr, 0);
        },

        getTotalPrice: function (cart) {
            return cart.map(value => value.product.price * value.amount).reduce((prev, curr) => prev + curr, 0);
        }

	};

});