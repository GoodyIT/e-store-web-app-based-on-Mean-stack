bluStore.directive('bluRate', function() {
	'use strict';

	return {
		restrict: "E",
		templateUrl: "templates/rate.html",
		scope: {},
		link: function(scope, element, attrs) {
			scope.total = attrs.total;
			var rateArr = [];
			var rating = attrs.rating + 1;

			for (var i = 1; i <= 5; i++){
				if((rating - i) > 0.5){
					rateArr.push(1);
				}
				else if((rating - i) <= 0.5) {
					rateArr.push(0.5);
				}
				else {
					rateArr.push(0);
				}
			}
			scope.rating = rateArr;
		}
	};

});