bluStore.controller('mainCtrl', ['$scope', '$rootScope', '$state', '$filter', 'categoriesFactory',
    function($scope, $rootScope, $state, $filter, categoriesFactory){
        "use strict";

        // pointer to the scope for internal use.
        var that = this;
        
        // loading state 
        $rootScope.stateLoading = {
            app: false,
            content: false,
            admin: false
        };

        /**
         * register event to track view changes and
         * reflect it on the navbar which is connected
         * via activeView variable
         */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            //console.log("toState: " + toState.name + " - fromState: " + fromState);
            that.activeView = toState.name;

            if (toState.name === 'app') {
                $rootScope.stateLoading.app = true;
                that.showHeader = true;
            }
            else if (toState.name === 'app.admin') {
                // make sure admin is logged in before move to admin page
                if (!$rootScope.isLoggedIn || !$rootScope.isAdmin) {
                    event.preventDefault();
                }
                else {
                    $rootScope.stateLoading.app = true;
                    that.showHeader = false;
                }
            }
            else {
                that.showHeader = false;
            }
        });

        $rootScope.$on('$stateChangeError', function(){
            $rootScope.stateLoading.app = false;
            $rootScope.stateLoading.content = false;
            $rootScope.stateLoading.admin = false;
        });
        $rootScope.$on('$stateNotFound', function(event, unFoundState){
            $rootScope.stateLoading.app = false;
            $rootScope.stateLoading.content = false;
            $rootScope.stateLoading.admin = false;
        });

        $rootScope.$on('$viewContentLoading');
        $rootScope.$on('$viewContentLoaded', function() {
        });

        $rootScope.$on('$stateChangeSuccess', function(){
            
        });

        // get all categories and set them to the scope
        categoriesFactory.getAll().get(function(result){
            that.categories = result.data;
        });

    }]
);
