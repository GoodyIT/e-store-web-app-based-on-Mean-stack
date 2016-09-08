bluStore.factory('categoriesFactory', function ($resource, API) {
    'use strict';

    return {

        getAll: function(format){
            return $resource(API.VIEW_CATEGORIES, { format: format });
        },

        getById: function (id) {
            return $resource(API.VIEW_CATEGORY, { id: id });
        },

        add: function (name, parentId) {
            
            var categoryData = {
                name: name,
                parent: parentId
            };

            return $resource(API.ADD_CATEGORY).save({}, { name: name, parent: parentId }).$promise;
        }

    };
});