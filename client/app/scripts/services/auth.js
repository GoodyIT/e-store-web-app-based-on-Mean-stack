bluStore.factory('authFactory', function ($resource, API) {
    'use strict';

    return {

        login: function(userName, password){

            return $resource(API.USER_LOGIN)
                .save({}, { username: userName, password: password }).$promise;

        },

        logout: function() {

            return $resource(API.USER_LOGOUT);

        },

        /**
         * "GET" request on /users/token to validate user token
         * httpInterceptor will catch errors if any so we don't
         * need to wait for any response 
         */
        verifyToken: function () {
            return $resource(API.USER_TOKEN);
        }

    };

});