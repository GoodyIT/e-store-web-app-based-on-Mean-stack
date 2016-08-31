var bluStore = angular.module('bluStore', ['ui.router', 'ngResource']);

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
            url: 'help',
            views: {
                'content@': {
                    templateUrl: "views/help.html"
                }
            }
        });

    // register the http interceptors
    $httpProvider.interceptors.push('httpInterceptor');

});

bluStore.run(function() {
    $("[data-toggle='tooltip']").tooltip();
});
