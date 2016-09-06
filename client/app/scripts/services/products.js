bluStore.factory('productsFactory', function ($resource, API) {
    'use strict';

    return {

        getAll: function(){
            return $resource(API.VIEW_PRODUCTS);
        },

        getById: function(id){

            return $resource(API.VIEW_PRODUCT, { id: id });

        },

        getCategoryById: function(id){
            return $resource(API.VIEW_PRODUCT_CAT_ID, { id: id });
        },

        deleteById: function(id) {
            return $resource(API.DEL_PRODUCT, { id: id });
        }

    };
});