bluStore.factory('categoriesFactory', function ($resource, CONFIG, API) {
    'use strict';

    var url = CONFIG.SERVER_URL;

    return {

        getAll: function(){
            return $resource(url + API.VIEW_CATEGORIES, { format: 'tree' });
        },

        getById: function (id) {
            return $resource(url + API.VIEW_CATEGORY, { id: id });
        }

    };
});