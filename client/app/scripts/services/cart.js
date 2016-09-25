bluStore.factory('cartFactory', function ($resource, API) {
	'use strict';

	return {

		getCart: function (userId) {
			return $resource(API.GET_CART, { id: userId }).get().$promise;
		},

		addProduct: function (userId, product) {
			return $resource(API.ADD_TO_CART, { id: userId })
				.save({}, { product: product }).$promise;
		},

		updateCart: function (userId, cart) {
			return $resource(API.UPDATE_CART, { id: userId }, { 'update': { method: 'PUT' } })
				.update(userId, { cart: cart }).$promise;
		}

	};

});