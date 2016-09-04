bluStore.controller('homeCtrl', ['$scope', '$rootScope', '$filter', 'productsFactory',
    function ($scope, $rootScope, $filter, productsFactory) {
        'use strict';

        // for internal use
        var that = this;

        // get all products and reorganize them to fit in bootstrap grid
        productsFactory.getAll().get(function (result) {
            that.products = $filter('productsGrid')(result.data, 3);
        });

        $scope.$on('$viewContentLoaded', function(event) {
            $rootScope.stateLoading.app = false;
        });

        $scope.homeCtrl = this;

    }]
);