bluStore.controller('homeCtrl', ['$scope', '$filter', 'productsFactory',
    function ($scope, $filter, productsFactory) {
        'use strict';

        // for internal use
        var that = this;

        // get all products and reorganize them to fit in bootstrap grid
        productsFactory.getAll().get(function (result) {
            that.products = $filter('productsGrid')(result.data, 3);
        });

        $scope.homeCtrl = this;

    }]
);