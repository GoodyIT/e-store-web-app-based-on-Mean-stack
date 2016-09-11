bluStore.directive('bluHeader', function () {
    'use strict';

    return {
        restrict: "E",
        templateUrl: "templates/header.html",
        link: function(scope, element, attrs){
            // trigger header carousel
            $('#header-carousel').carousel({interval: 3000, cycle: true});
        }
    };
});