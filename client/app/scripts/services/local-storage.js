bluStore.factory('localStorageFactory', ['$window', function($window){
    'use strict';

    return {

        store: function(key, value) {
            $window.localStorage[key] = value;
        },

        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },

        remove: function(key) {
            $window.localStorage.removeItem(key);
        },

        storeObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },

        getObject: function(key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };

}]);