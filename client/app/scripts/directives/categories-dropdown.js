bluStore.directive('bluCategoriesDropdown', function () {
	'use strict';

	return {
		restrict : "E",
		replace: true,
		templateUrl: "templates/categories-dropdown.html",
		link: function (scope, element, attrs) {
			$('#categories-dropdown').on('click', function (e) {
				e.stopPropagation();
            	e.preventDefault();
			});
		}
	};

});