bluStore.factory('productsFactory', function ($resource, CONFIG, API) {
    'use strict';

    var url = CONFIG.SERVER_URL;

    return {

        getAll: function(){
            return $resource(url + API.VIEW_PRODUCTS);
        },

        getById: function(id){

            return $resource(url + API.VIEW_PRODUCT, { id: id });

        },

        getCategoryById: function(id){
            return $resource(url + API.VIEW_PRODUCT_CAT_ID, { id: id });
        }

    };
});