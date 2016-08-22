bluStore.factory('localStorageFactory', ['$window', function($window){
    'use strict';

    return {

        store: function(key, value) {
            $window.localStorage
        },

        get: function(key, defaultValue) {

        },

        remove: function(key) {

        },

        storeObject: function(key, value) {

        },

        getObject: function(key, defaultValue) {

        }
    };

}]);