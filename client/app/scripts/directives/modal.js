// bootstrap3 modal wrapper for Angular 
bluStore.directive('bluModal', function ($rootScope) {
    'use strict';

    return {

        restrict: "A",
        link: function (scope, element, attrs) {

            // watch for trigger
            scope.$watch(attrs.bluTrigger, function (value) {
                if (value) {
                    element.modal('show');
                }
                else {
                    element.modal('hide');
                }
            });

            // Modal Events
            element.on('hidden.bs.modal', function (e) {
                // fire an event on root scope with modal id e.g myModal:hidden
                $rootScope.$broadcast(element[0].id + ':hidden', e);
            });

        }

    };

});