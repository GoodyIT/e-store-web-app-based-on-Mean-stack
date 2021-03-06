bluStore.factory('productsFactory', function ($resource, API) {
    'use strict';

    return {

        getAll: function () {
            return $resource(API.VIEW_PRODUCTS);
        },

        getById: function (id) {
            return $resource(API.VIEW_PRODUCT, { id: id });
        },

        search: function (text) {
            return $resource(API.SEARCH_PRODUCTS, { text: text });
        },

        getCategoryById: function (id) {
            return $resource(API.VIEW_PRODUCT_CAT_ID, { id: id });
        },

        deleteById: function (id) {
            return $resource(API.DEL_PRODUCT, { id: id });
        },

        getReviews: function (id) {
            return $resource(API.PRODUCT_REVIEWS, {id: id});
        },

        addReview: function (id, review) {
            return $resource(API.ADD_REVIEWS, { id: id }).save({}, { review: review }).$promise;
        }

    };
});