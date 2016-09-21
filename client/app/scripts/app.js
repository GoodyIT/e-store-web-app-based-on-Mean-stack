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
            },
            data: { auth: 'none' }
        })

        .state('app.category', {
            url: 'category/:id',
            views: {
                'content@': {
                    templateUrl: "views/category.html",
                    controller: 'categoryCtrl'
                }
            },
            data: { auth: 'none' }
        })

        .state('app.product', {

            url: 'product/:id',
            views: {
                'content@': {
                    templateUrl: "views/product.html",
                    controller: 'productCtrl'
                }
            },
            data: { auth: 'none' }

        })

        .state('app.search', {
            url: 'search/:text',
            views: {
                'content@': {
                    templateUrl: "views/search.html",
                    controller: "searchCtrl"
                }
            },
            data: { auth: 'none' }
        })

        .state('app.help', {
            url: 'help/',
            views: {
                'content@': {
                    templateUrl: "views/help.html"
                }
            },
            data: { auth: 'none' }
        })

        .state('app.admin', {
            url: 'admin/',
            views: {
                'content@': {
                    templateUrl: "views/admin.html",
                    controller: "adminCtrl"
                }
            },
            data: { auth: 'admin' }
        })

        .state('app.admin.orders', {
            url: 'orders/',
            views: {
                'settings': {
                    templateUrl: "views/admin-orders.html",
                    controller: "adminOrdersCtrl"
                }
            },
            data: { auth: 'admin' }
        })

        .state('app.admin.newproduct', {
            url: 'newproduct/',
            views: {
                'settings': {
                    templateUrl: "views/admin-newproduct.html",
                    controller: "adminNewProductCtrl"
                }
            },
            data: { auth: 'admin' }
        })

        .state('app.admin.categories', {
            url: 'categories/',
            views: {
                'settings': {
                    templateUrl: "views/admin-categories.html",
                    controller: "adminCategories"
                }
            },
            data: { auth: 'admin' }
        });

    // register the http interceptors
    $httpProvider.interceptors.push('httpInterceptor');

});

bluStore.run(function ($rootScope) {
    // global variables to track states 
    $rootScope.activeState = 'none';
    $rootScope.loadingState = 'none';

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // pervent nav to user/admin pages without auth
        if (toState.data.auth === 'admin' && (!$rootScope.userInfo || !$rootScope.userInfo.isAdmin)) {
            event.preventDefault();
            return false;
        }
        else if (toState.data.auth === 'user' && !$rootScope.userInfo) {
            event.preventDefault();
            return false;
        }

        // set target state in loading 
        $rootScope.loadingState = toState.name;

    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        // TODO
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        // TODO
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.activeState = toState.name;
    });

});