bluStore.controller('categoryCtrl', ['$scope', '$stateParams', '$filter', 'productsFactory',
    function ($scope, $stateParams, $filter, productsFactory) {
        'use strict';

        var that = this;
        this.isLoading = true;

        productsFactory.getCategoryById($stateParams.id).get(function(result){
            that.products = $filter('productsGrid')(result.data, 3);
            that.isLoading = false;
        });

        $scope.categoryCtrl = this;

    }]
);