bluStore.controller('productCtrl', ['$scope', '$rootScope', 'productsFactory', '$stateParams', '$state',
	function ($scope, $rootScope, products, $stateParams, $state) {

		var ctr = this;
		var rvRate = 1;
		ctr.canReview = false;

		ctr.reviews = [];
		ctr.rateCount = {
			oneStar: 0,
			twoStar: 0,
			threeStar: 0,
			fourStar: 0,
			fiveStar: 0
		};

		products.getById($stateParams.id).get(function (result) {
			ctr.product = result.data;
		});

		$rootScope.$watch('userInfo', function (newValue) {
			// user logged in 
			if (newValue) {
				// check if this user has review for this product
				if (ctr.reviews) {
					if (ctr.reviews.find((value) => value.user._id === newValue.id)) {
						ctr.canReview = false;
					}
					else {
						ctr.canReview = true;
					}
				}
				else {
					ctr.canReview = true;
				}
			}
			else {
				ctr.canReview = false;
			}
		});

		$scope.$watch('productCtr.reviews', function (newValue) {
			if (newValue) {
				// got reviews
				if ($rootScope.userInfo) {
					if (ctr.reviews.find((value) => value.user._id === $rootScope.userInfo.id)) {
						ctr.canReview = false;
					}
					else {
						ctr.canReview = true;
					}
				}
				else {
					ctr.canReview = false;
				}
			}
			else {
				ctr.canReview = true;
			}
		});

		// on reviews tab show 
		$('#product-reviews-tab').on('show.bs.tab', function (e) {
			ctr.rateCount = {
				oneStar: 0,
				twoStar: 0,
				threeStar: 0,
				fourStar: 0,
				fiveStar: 0
			};
			// load reviews data
			products.getReviews(ctr.product._id).get(
				function (result) {
					ctr.reviews = result.data;
					if ($rootScope.userInfo) {
						if (ctr.reviews.find( (value) => value.user._id === $rootScope.userInfo.id )) {
							ctr.hasReview = true;
						}
						else {
							ctr.hasReview = false;
						}
					}
					
					for (var i = 0; i < ctr.reviews.length; i++) {
						if (ctr.reviews[i].rate === 5) {
							ctr.rateCount.fiveStar ++;
						}
						else if (ctr.reviews[i].rate === 4) {
							ctr.rateCount.fourStar ++;
						}
						else if (ctr.reviews[i].rate === 3) {
							ctr.rateCount.threeStar ++;
						}
						else if (ctr.reviews[i].rate === 2) {
							ctr.rateCount.twoStar ++;
						}
						else if (ctr.reviews[i].rate === 1) {
							ctr.rateCount.oneStar ++;
						}
					}

				},
				function (err) {
					// no reviews found
					if ($rootScope.userInfo) {
						ctr.hasReview = false;
					}
				}
			);
		});

		$('#addReviewModel').on('hidden.bs.modal', function (e) {
			$state.reload();
		});

		ctr.ratePercent = function (count) {
			if(ctr.product){
				return (count * 100) / ctr.product.rating.count; 
			}
			return 0;
		};

		ctr.addReview = function () {
			
			if (!$rootScope.userInfo) {
				return;
			}

			var review = {
				user: $rootScope.userInfo.id,
				rate: rvRate,
				comment: ctr.rvComment
			};

			products.addReview(ctr.product._id, review).then(
				function (result) {
					ctr.rvMessage = 'you submited a new review, thanks for taking the time.';
					ctr.rvMsgErr = false;
					ctr.rvComment = "";
					ctr.rvForm.$setPristine();
				},
				function (err) {
					ctr.rgMessage = 'error while trying to add new review!';
					ctr.rvMsgErr = true;
				}
			);
		};

		var selectRateStar = [
			'#select-star1',
			'#select-star2',
			'#select-star3',
			'#select-star4',
			'#select-star5'
		];

		$("#select-star1").click(function () {
			for (var i = 0; i < 5; i++) {
				if (i < 1) { 
					$(selectRateStar[i]).addClass('fa-star');
					$(selectRateStar[i]).removeClass('fa-star-o');
				}
				else {
					$(selectRateStar[i]).addClass('fa-star-o');
					$(selectRateStar[i]).removeClass('fa-star');
				}
			}
			rvRate = 1;
		});
		$("#select-star2").click(function () {
			for (var i = 0; i < 5; i++) {
				if (i < 2) { 
					$(selectRateStar[i]).addClass('fa-star');
					$(selectRateStar[i]).removeClass('fa-star-o');
				}
				else {
					$(selectRateStar[i]).addClass('fa-star-o');
					$(selectRateStar[i]).removeClass('fa-star');
				}
			}
			rvRate = 2;
		});
		$("#select-star3").click(function () {
			for (var i = 0; i < 5; i++) {
				if (i < 3) { 
					$(selectRateStar[i]).addClass('fa-star');
					$(selectRateStar[i]).removeClass('fa-star-o');
				}
				else {
					$(selectRateStar[i]).addClass('fa-star-o');
					$(selectRateStar[i]).removeClass('fa-star');
				}
			}
			rvRate = 3;
		});
		$("#select-star4").click(function () {
			for (var i = 0; i < 5; i++) {
				if (i < 4) { 
					$(selectRateStar[i]).addClass('fa-star');
					$(selectRateStar[i]).removeClass('fa-star-o');
				}
				else {
					$(selectRateStar[i]).addClass('fa-star-o');
					$(selectRateStar[i]).removeClass('fa-star');
				}
			}
			rvRate = 4;
		});
		$("#select-star5").click(function () {
			for (var i = 0; i < 5; i++) {
				$(selectRateStar[i]).addClass('fa-star');
				$(selectRateStar[i]).removeClass('fa-star-o');
			}
			rvRate = 5;
		});

		$scope.productCtr = this;

	}
]);