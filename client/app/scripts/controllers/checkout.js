bluStore.controller('checkoutCtrl', ['$scope', '$rootScope', 'CONFIG',
    function ($scope, $rootScope, CONFIG) {
        'use strict';

        $scope.$on('$viewContentLoaded', function (event) {
            // stop loading screen if exist
            if ($rootScope.loadingState === 'app.checkout') {
                $rootScope.loadingState = 'none';
            }
        });

        var handler = StripeCheckout.configure({
            key: CONFIG.STRIPE_PUB_KEY,
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function (token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                console.log(token);
                $scope.$apply(function () {
                    $scope.paid = true;
                });
            }
        });

        $('#btn-stripe-chkout').on('click', function (e) {
            // Open Checkout with further options:
            handler.open({
                name: 'Demo Site',
                description: '2 widgets',
                amount: 2000
            });
            e.preventDefault();
        });

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
            handler.close();
        });

    }
]);