bluStore.controller('mainCtrl', ['$scope', '$rootScope', '$filter', 'categoriesFactory',
    function($scope, $rootScope, $filter, categoriesFactory){
        "use strict";
        
        // pointer to the scope for internal use.
        var that = this;

        /**
         * register event to track view changes and
         * reflect it on the navbar which is connected
         * via activeView variable
         */
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            that.activeView = toState.name;
            if(toState.name !== 'app') {
                that.showHeader = false;
            }
            else {
                that.showHeader = true;
            }
        });

        // get all categories and set them to the scope
        categoriesFactory.getAll().get(function(result){
            that.categories = result.data;
        });

    }]
);
