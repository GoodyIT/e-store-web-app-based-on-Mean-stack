bluStore.directive('bluBtnLoading', function () {
    'use strict';

    return {

        restrict: "A",
        link: function (scope, element, attr) {

            var text = element[0].innerHTML;

            scope.$watch(attr.bluBtnLoading, function (value) {
                if (value) {
                    element.prop('disabled', true);
                    element[0].innerHTML = "<i class='fa fa-spin fa-spinner'></i>";
                }
                else {
                    element.prop('disabled', false);
                    element.button('reset');
                }
            });

        }

    };

});