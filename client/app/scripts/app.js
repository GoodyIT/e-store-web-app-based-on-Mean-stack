var bluStore = angular.module('bluStore', ['ui.router']);

bluStore.config(function ($stateProvider, $urlRouterProvider) {
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

        .state('app.help', {
            url: 'help',
            views: {
                'content@': {
                    templateUrl: "views/help.html"
                }
            }
        });

});