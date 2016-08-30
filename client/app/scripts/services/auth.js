bluStore.factory('authFactory', function ($resource, API) {
    'use strict';

    return {

        login: function(userName, password){

            return $resource(API.USER_LOGIN)
                .save({}, { username: userName, password: password }).$promise;

        },

        logout: function() {

            return $resource(API.USER_LOGOUT);

        }

    };

});