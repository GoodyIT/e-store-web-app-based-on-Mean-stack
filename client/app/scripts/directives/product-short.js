bluStore.directive('productShort', function(){
    return {
        restrict: 'E',
        scope: {
            productName: '@'
        },
        templateUrl: "templates/product-short.html"
    };
});