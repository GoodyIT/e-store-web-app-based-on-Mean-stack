bluStore.controller('cartCtrl', ['$scope', 'cartFactory', '$rootScope', 'EVENTS', 'CONFIG', 'localStorageFactory',
    function ($scope, cartFactory, $rootScope, EVENTS, CONFIG, localStorage) {
        'use strict';

        var scope = $scope;

        // stop loading screen if exist
        if ($rootScope.loadingState === 'app.cart') {
            $rootScope.loadingState = 'none';
        }

        // init local cart
        scope.cart = [];

        // delete one product from cart
        scope.delOneFromCart = function (productId) {
            var productIndex = scope.cart.indexOf(scope.cart.find(value => value.product._id == productId));

            if (productIndex > -1) {


                // reflect cart update on server/local storage
                if ($rootScope.userInfo) {
                    // update cart on server 
                    cartFactory.delOneFromCart(scope.cart[productIndex]._id).then(
                        function (result) {
                            scope.cart = result.data.cart;
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }
                else {
                    // update cart 
                    if (scope.cart[productIndex].amount > 1) {
                        scope.cart[productIndex].amount--;
                    }
                    else {
                        scope.cart.splice(productIndex, 1);
                    }
                    // update local storage cart
                    localStorage.storeObject(CONFIG.CART_STORE_KEY, scope.cart);
                }
            }
        };

        // on login or logout or user data changes 
        $rootScope.$watch('userInfo', function (userInfo) {
            if (userInfo) {
                scope.$broadcast(EVENTS.LOAD_CART);
            }
            else {
                scope.cart = [];
                // load saved cart from cookies
                var localCart = localStorage.getObject(CONFIG.CART_STORE_KEY);
                if (localCart && Array.isArray(localCart) && localCart.length > 0) {
                    scope.cart = localCart;
                }
            }
        });

        /** ON LOAD CART EVENT */
        scope.$on(EVENTS.LOAD_CART, function () {

            var userInfo = $rootScope.userInfo;

            // if user logged in and local cart is empty
            if (userInfo && scope.cart.length === 0) {
                // get user cart data from the server
                cartFactory.getCart(userInfo.id).then(
                    function (result) {
                        // add user cart data
                        scope.cart = result.data;
                    },
                    function (err) {
                        scope.cart = [];
                    }
                );
            }
            // else if user logged in and local cart is not empty
            else if (userInfo && scope.cart.length > 0) {
                // update user cart on server and get the new cart data
                var simpleCart = scope.shortenCart(scope.cart);
                cartFactory.addProduct(userInfo.id, simpleCart).then(
                    function (result) {
                        localStorage.remove(CONFIG.CART_STORE_KEY);
                        scope.cart = result.data.cart;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }
            // if user logged out or no user at all
            else {
                scope.cart = [];
            }
        });

        /** ON ADD TO CART EVENT */
        scope.$on(EVENTS.ADD_TO_CART, function (event, product, amount) {
            var cartItem = {};

            // user and product exist => add product to user cart
            if ($rootScope.userInfo && product) {
                // user logged in 
                cartItem = { product: product._id, amount: amount || 1 };
                cartFactory.addProduct($rootScope.userInfo.id, cartItem).then(
                    function (result) {
                        scope.cart = result.data.cart;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }
            // no user => add product to the local cart
            else if (!$rootScope.userInfo && product) {
                // no user so save to cookie
                // check if this product already exist in the cart
                var cartExItem = scope.cart.find(value => value.product._id === product._id);

                if (cartExItem) {
                    cartExItem.amount = parseInt(cartExItem.amount) + parseInt(amount || 1);
                }
                else {
                    cartItem = {
                        product: product,
                        amount: amount || 1
                    };

                    scope.cart.push(cartItem);
                }
                // clear cookie and store the new data
                localStorage.remove(CONFIG.CART_STORE_KEY);
                localStorage.storeObject(CONFIG.CART_STORE_KEY, scope.cart);
            }

        });

        /** ON UPDATE CART EVENT */
        scope.$on(EVENTS.UPDATE_CART, function (event, cart) {
            // check user is exist 
            if ($rootScope.userInfo) {
                var simpleCart = scope.shortenCart(cart);
                cartFactory.updateCart($rootScope.userInfo.id, simpleCart).then(
                    function (result) {
                        localStorage.remove(CONFIG.CART_STORE_KEY);
                        scope.cart = result.data.cart;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }
        });

        // remove any unnecessary data from the cart before send to the server
        scope.shortenCart = function (cart) {
            if (Array.isArray(cart)) {
                var simpleCart = [];
                for (var i = 0; i < cart.length; i++) {
                    simpleCart.push({
                        product: cart[i].product._id,
                        amount: cart[i].amount
                    });
                }
                return simpleCart;
            }
            else {
                var simpleItem = {
                    product: cart.product._id,
                    amount: cart.amount
                };
            }
        };

        
        scope.getTotalAmount = cartFactory.getTotalAmount;
        scope.getTotalPrice = cartFactory.getTotalPrice;

    }
]);