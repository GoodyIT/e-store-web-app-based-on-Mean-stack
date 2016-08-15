bluStore.directive('bluProductShort', function(){
    'use strict';

    return {
        restrict: 'E',
        scope: {
            productInfo: '='
        },
        templateUrl: "templates/product-short.html"
    };
});