bluStore.directive('bluCategoriesDropdown', function () {
	'use strict';

	return {
		restrict : "E",
		replace: true,
		templateUrl: "templates/categories-dropdown.html",
        link: function (scope, element, attr) {
           element.on('hide.bs.dropdown', function (e) {
				console.log(e);
            });
        }
	};

});