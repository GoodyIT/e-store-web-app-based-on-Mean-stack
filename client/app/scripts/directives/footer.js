bluStore.directive('bluFooter', function(){
    "use strict";

    return {
        restrict : "E",
        templateUrl: "templates/footer.html",
        link: function () {
            $("[data-toggle='tooltip']").tooltip();
        }
    };
});