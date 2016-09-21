bluStore.directive('bluNavbar', function () {
    'use strict';

    return {
        restrict: "E",
        templateUrl: "templates/navbar.html",
        link: function (scope) {

            $("#menu-toggle").click(function (e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

        }
    };
});