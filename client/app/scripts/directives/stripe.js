bluStore.directive('bluStripe', ['CONFIG', 'EVENTS', '$rootScope',
    function (CONFIG, EVENTS, $rootScope) {
        'use strict';

        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                
                // stripe handler
                var handler = StripeCheckout.configure({
                    key: CONFIG.STRIPE_PUB_KEY,
                    image: CONFIG.STRIPE_CHEKOUT_LOGO,
                    locale: 'auto',
                    token: function (token) {
                        $rootScope.$broadcast(EVENTS.STRIPE_TOKEN_RECEIVED, token);
                    }
                });

                element.on('click', function (e) {
                    // Open Checkout with further options:
                    handler.open({
                        name: CONFIG.SITE_NAME,
                        description: attrs.description,
                        amount: parseInt(attrs.amount) * 100
                    });
                    e.preventDefault();
                });

                // Close Checkout on page navigation:
                window.addEventListener('popstate', function () {
                    handler.close();
                });
            }
        };

    }
]);