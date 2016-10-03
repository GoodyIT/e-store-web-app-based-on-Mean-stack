bluStore.factory('cartFactory', ['$resource', 'API', 'localStorageFactory', 'CONFIG', '$rootScope', 'EVENTS',
    function ($resource, API, localStorage, CONFIG, $rootScope, EVENTS) {
        'use strict';

        /** some functions for local use */

        // add one item at a time to the cart 
        function addItemToCart(cart, item) {
            var cartItem = cart.find(value => value.product._id == item.product._id);

            if (cartItem) {
                cartItem.amount += parseInt(item.amount);
            }
            else {
                cart.push(item);
            }

            return cart;
        }

        // remove any unnecessary data from the cart before send to the server
        function shortenCart(cart) {
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
                return {
                    product: cart.product._id,
                    amount: cart.amount
                };
            }
        }

        function cartChanged(cart) {
            $rootScope.$broadcast(EVENTS.CART_CHANGED, cart);
        } 

        var cartObj = {

            get: function () {
                // get local cart if exist
                var cart = localStorage.getObject(CONFIG.CART_STORE_KEY);

                // if no cart exist init new one
                if (!cart) {
                    cart = [];
                }

                return cart;
            },

            save: function (cart) {
                // save changes to local storage
                localStorage.storeObject(CONFIG.CART_STORE_KEY, cart);
            },

            clear: function () {
                // remove this cart
                localStorage.remove(CONFIG.CART_STORE_KEY);
            }

        };


        // returned service object
        return {

            userCart: {

                // get full user cart
                get: function () {
                    // chech for local cart items 
                    var locCart = cartObj.get();

                    // if there is local cart 
                    if (locCart.length > 0) {
                        // add this items to user cart and broadcast it then clear local cart
                        this.add(locCart); 
                    }
                    // if no local cart exist
                    else {
                        // just get user cart and broadcast it
                        $resource(API.GET_CART).get(
                            function (result) {
                                cartChanged(result.data.cart);
                            },
                            function (err) {
                                cartChanged([]);
                            }
                        );
                    }
                },

                // add item/s to user cart
                add: function (item) {
                    
                    item = shortenCart(item);

                    $resource(API.ADD_TO_CART)
                        .save({}, { cartItems: item }).$promise.then(
                            function (result) {
                                cartChanged(result.data.cart);
                                cartObj.clear(); // clear local cart
                            }
                        );

                },

                // remove one item from cart
                remove: function (itemId) {
                    $resource(API.DEL_ONE_FROM_CART, { id: itemId }).remove().$promise.then(
                        function (result) {
                            cartChanged(result.data.cart);
                        }
                    );
                },

                // update user cart with new cart data
                update: function (newCart) {
                    $resource(API.UPDATE_CART, {}, { 'update': { method: 'PUT' } })
                        .update({}, { cart: newCart }).$promise.then(
                            function (result) {
                                cartChanged(result.data.cart);
                            }
                        );
                }

            },

            localCart: {

                // get full local cart
                get: function () {
                    cartChanged(cartObj.get());
                },

                // add item/s to local cart
                add: function (item) {
                    // get local cart if exist or init
                    var cart = cartObj.get();

                    // make sure item type is array
                    if (!Array.isArray(item)) item = [item];

                    for (var i = 0; i < item.length; i++) {
                        addItemToCart(cart, item[i]); // add item to cart by refrence
                    }

                    // save changes to local storage
                    cartObj.save(cart);

                    // broadcast cart changed event
                    cartChanged(cart);

                },

                // remove one item from cart
                remove: function (productId) {

                    // get local cart if exist or init
                    var cart = cartObj.get();

                    // get product index from the cart
                    var productIndex = cart.indexOf(cart.find(value => value.product._id == productId));

                    if (productIndex > -1) {
                        if (cart[productIndex].amount > 1) {
                            // decrease product amount
                            cart[productIndex].amount--;
                        }
                        else {
                            // remove this product from cart
                            cart.splice(productIndex, 1);
                        }

                        // save changes to this cart
                        cartObj.save(cart);
                    }

                    // broadcast cart changed event
                    cartChanged(cart);

                },

                // update local cart with new cart data
                update: function (newCart) {
                    cartObj.save(newCart);
                    // broadcast cart changed event
                    cartChanged(newCart);
                }

            },

            // calc total amount of all the products in this cart
            getTotalAmount: function (cart) {
                if(!cart || cart.length < 1) {
                    return 0;
                }
                return cart.map(value => value.amount).reduce((prev, curr) => prev + curr, 0);
            },

            // calc total price of all the products in this cart
            getTotalPrice: function (cart) {
                if(!cart || cart.length < 1) {
                    return 0;
                }
                return cart.map(value => value.product.price * value.amount).reduce((prev, curr) => prev + curr, 0);
            }

        };

    }
]);