bluStore.directive('bluNavbar', function () {
    'use strict';

    return {
        restrict: "E",
        scope: {
            categoriesList: '=',
            activeView: '='
        },
        templateUrl: "templates/navbar.html"
    };
});