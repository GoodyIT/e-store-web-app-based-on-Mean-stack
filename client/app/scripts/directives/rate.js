bluStore.directive('bluRate', function () {
	'use strict';

	return {
		restrict: "E",
		templateUrl: "templates/rate.html",
		scope: {
			total: '='
		},
		link: function (scope, element, attrs) {

			attrs.$observe('rating', function (value) {
				var rateArr = [0, 0, 0, 0, 0];
				var avrRate = attrs.rating;

				for (var i = 0; i < 5; i++) {
					// one star
					if (avrRate > 0.9) {
						rateArr[i] = 1;
						avrRate--;
					}
					// half star
					else if (avrRate > 0.4) {
						rateArr[i] = 0.5;
						avrRate -= avrRate;
					}
				}
				scope.avrRate = rateArr;

			});
		}
	};

});