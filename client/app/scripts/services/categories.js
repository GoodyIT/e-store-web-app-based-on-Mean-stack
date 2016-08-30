bluStore.factory('categoriesFactory', function ($resource, API) {
    'use strict';

    return {

        getAll: function(){
            return $resource(API.VIEW_CATEGORIES, { format: 'tree' });
        },

        getById: function (id) {
            return $resource(API.VIEW_CATEGORY, { id: id });
        }

    };
});