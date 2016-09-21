bluStore.factory('cartFactory', function ($resource, API) {
	'use strict';

	return {

		getCart: function (userId) {
			return $resource(API.GET_CART, { id: userId }).get().$promise;
		}

	};

});