bluStore.controller('checkoutCtrl', ['$scope', '$rootScope', 'CONFIG', 'EVENTS', 'cartFactory','$state',
    function ($scope, $rootScope, CONFIG, EVENTS, cartFactory, $state) {
        'use strict';

        $scope.totalPrice = 0;
        $scope.responseModal = false;
        var orderData = {};

        // load user cart data
        cartFactory.userCart.get();

        $scope.$on(EVENTS.CART_CHANGED, function (event, cart) {
            // set user cart to scope
            $scope.cart = cart;
            // set total price to scope
            $scope.totalPrice = cartFactory.getTotalPrice(cart);

            // stop loading screen if exist
            if ($rootScope.loadingState === 'app.checkout') {
                $rootScope.loadingState = 'none';
            }
        });



        $rootScope.$on(EVENTS.STRIPE_TOKEN_RECEIVED, function (event, token) {
            // add stripe token info to order data
            orderData = {
                cardToken: token.id,
                items: $scope.cart,
                custName: $scope.frmName,
                custPhone: $scope.frmPhone,
                custEmail: token.email,
                custAddress: $scope.frmAddress,
                payMethod: 'stripe'
            };

            $scope.$apply(function () {
                $scope.paid = true;
            });
        });

        $scope.submitOrder = function () {

            $scope.btnCheckoutLoading = true;

            cartFactory.userCart.checkout(orderData)

                .then(function (result) {
                    // load user cart data
                    cartFactory.userCart.get();
                    $scope.checkoutError = null;
                    $scope.checkoutResponse = 'your order placed successfully!';
                })

                .catch(function (err) {
                    $scope.checkoutResponse = null;
                    $scope.checkoutError = 'there was an error while trying to place your order!';
                })

                .finally(function () {
                    // show response modal
                    $scope.responseModal = true;
                    // stop loading state for checkout button
                    $scope.btnCheckoutLoading = false;
                });

        };

        $scope.$on('chkout-response-modal:hidden', function (event, e) {

            // modal close on success
            if ($scope.checkoutResponse) {
                $state.go('app');
            }
            // modal close on error
            else if ($scope.checkoutError) {

            }

            $scope.responseModal = false;

        });
    }
]);