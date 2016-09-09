bluStore.controller('categoryCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'productsFactory',
    function ($scope, $rootScope, $stateParams, $filter, productsFactory) {
        'use strict';

        var that = this;
        this.isLoading = true;

        var categoryId = $rootScope.categoriesList.find(function (obj) {
            return obj.slug === $stateParams.id;
        })._id;

        productsFactory.getCategoryById(categoryId).get(function(result){
            that.products = $filter('productsGrid')(result.data, 3);
            that.isLoading = false;
        });

        $scope.categoryCtrl = this;

    }]
);