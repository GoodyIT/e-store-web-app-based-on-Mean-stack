bluStore.factory('authFactory', function ($resource, CONFIG, API) {
    'use strict';

    var url = CONFIG.SERVER_URL;

    return {

        login: function(userName, password){

            return $resource(url + API.USER_LOGIN)
                .save({}, { username: userName, password: password }).$promise;

        }

    };

});