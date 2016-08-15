bluStore.controller('homeCtrl', ['$scope', '$filter', 'productsFactory',
    function($scope, $filter, productsFactory){
    'use strict';

    // get all products and reorganize them to fit in bootstrap grid
    this.products = $filter('productsGrid')(productsFactory.products, 3);

    $scope.homeCtrl = this;
}]);