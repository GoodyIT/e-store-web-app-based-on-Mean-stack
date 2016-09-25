bluStore.directive('bluProductShort', ['$rootScope', 'EVENTS',
    function ($rootScope, EVENTS) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: "templates/product-short.html",
            link: function (scope, element, attrs) {
                scope.addToCart = function (product) {
                    $rootScope.$broadcast(EVENTS.ADD_TO_CART, product);
                };
            }
        };
    }]
);