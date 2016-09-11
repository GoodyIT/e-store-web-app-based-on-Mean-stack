var bluStore = angular.module('bluStore', ['ui.router', 'ngResource', 'ngFileUpload']);

bluStore.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    "use strict";

    // For any unmatched url, redirect to /index
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: "views/header.html"
                },
                'content': {
                    templateUrl: "views/home.html",
                    controller: 'homeCtrl'
                },
                'footer': {
                    templateUrl: "views/footer.html"
                }
            }
        })

        .state('app.category', {
            url: 'category/:id',
            views: {
                'content@': {
                    templateUrl: "views/category.html",
                    controller: 'categoryCtrl'
                }
            }
        })

        .state('app.product', {

            url: 'product/:id',
            views: {
                'content@': {
                    templateUrl: "views/product.html",
                    controller: 'productCtrl'
                }
            }

        })

        .state('app.help', {
            url: 'help/',
            views: {
                'content@': {
                    templateUrl: "views/help.html"
                }
            }
        })
        
        .state('app.admin', {
            url: 'admin/',
            views: {
                'content@': {
                    templateUrl: "views/admin.html",
                    controller: "adminCtrl"
                }
            }
        })
        
        .state('app.admin.orders', {
            url: 'orders/',
            views: {
                'settings': {
                    templateUrl: "views/admin-orders.html",
                    controller: "adminOrdersCtrl"
                }
            }
        })
        
        .state('app.admin.newproduct', {
            url: 'newproduct/',
            views: {
                'settings': {
                    templateUrl: "views/admin-newproduct.html",
                    controller: "adminNewProductCtrl"
                }
            }
        })
        
        .state('app.admin.categories', {
            url: 'categories/',
            views: {
                'settings': {
                    templateUrl: "views/admin-categories.html",
                    controller: "adminCategories"
                }
            }
        });

    // register the http interceptors
    $httpProvider.interceptors.push('httpInterceptor');

});
