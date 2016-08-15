bluStore.controller('categoryCtrl', ['$scope', '$stateParams', '$filter', 'productsFactory',
    function ($scope, $stateParams, $filter, productsFactory) {
        'use strict';

        var products = productsFactory.getByCategoryId($stateParams.id);

        this.products = $filter('productsGrid')(products, 3);

        $scope.categoryCtrl = this;

    }]
);