bluStore.factory('httpInterceptor', function ($httpProvider) {
    'use strict';

    return {

        setToken: function (token) {
            $httpProvider.defaults.headers['Token']
        }

    };
});