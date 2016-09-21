bluStore.controller('userCtrl', ['$rootScope', '$http', 'authFactory', 'localStorageFactory',
    'CONFIG', 'EVENTS', 'ERRORS', 'cartFactory',
    function ($rootScope, $http, authFactory, localStorage, CONFIG, EVENTS, ERRORS, cartFactory) {
        'use strict';

        var that = this;
        var userInfo;
        this.userEmail = '';
        this.password = '';
        this.keepInfo = false;
        this.firstName = '';
        this.lastName = '';
        this.fullName = '';
        this.userImage = '';
        this.emailErr = false;
        this.passErr = false;
        this.isAdmin = false;
        this.isLoggedIn = false;

        // verify user token
        authFactory.verifyToken().get();

        // Logged in event
        $rootScope.$on(EVENTS.USER_LOGGED_IN, function (event, userData, token) {

            userInfo = userData;
            $rootScope.userInfo = userInfo;

            // on login success
            that.password = '';
            that.firstName = userData.firstName;
            that.lastName = userData.lastName;
            that.fullName = that.firstName + ' ' + that.lastName;
            that.userImage = userData.imageUrl;
            that.isLoggedIn = true;
            that.isAdmin = userData.isAdmin;

            if (token) {
                // save token to local storage
                localStorage.storeObject(CONFIG.TOKEN_STORE_KEY, {
                    token: token,
                    userData: userData
                }, {});
            }

        });

        // Logged out event
        $rootScope.$on(EVENTS.USER_LOGGED_OUT, function () {
            // user logout
            $rootScope.userInfo = null;
            that.firstName = '';
            that.lastName = '';
            that.fullName = '';
            that.userImage = '';
            that.isLoggedIn = false;
            that.isAdmin = false;

            localStorage.remove(CONFIG.TOKEN_STORE_KEY);

        });

        // Login error event
        $rootScope.$on(EVENTS.USER_LOGIN_ERROR, function (event, errMsg) {
            // on login error
            if (errMsg === ERRORS.INVALID_USER_NAME) {
                that.emailErr = true;
                that.passErr = false;
            }
            else if (errMsg === ERRORS.INVALID_USER_PASSWORD) {
                that.emailErr = false;
                that.passErr = true;
            }
        });

        $rootScope.$on(EVENTS.USER_REQUIRED, function (event) {
            // user logout
            $rootScope.userInfo = null;
            that.firstName = '';
            that.lastName = '';
            that.fullName = '';
            that.userImage = '';
            that.isLoggedIn = false;
            that.isAdmin = false;

            localStorage.remove(CONFIG.TOKEN_STORE_KEY);
        });

        $rootScope.$on(EVENTS.ADMIN_REQUIRED, function (event) {
            localStorage.remove(CONFIG.TOKEN_STORE_KEY);
        });


        /*
         * look for stored token in the local storage
         * if found than set it to headers as Token
         * then send a "get User data" to the back-end,
         * with a "Logged in" callback to login the user
         * if the token is still valid.
         */

        var user = localStorage.getObject(CONFIG.TOKEN_STORE_KEY);
        if (user) {
            // login user with local data 
            $rootScope.$broadcast(EVENTS.USER_LOGGED_IN, user.userData);
        }

        // user login using form data
        this.login = function () {
            authFactory.login(that.userEmail, that.password).then(
                function (result) {
                    // fire "user logged in" event with user data & token
                    $rootScope.$broadcast(EVENTS.USER_LOGGED_IN, result.userData, result.token);
                },
                function (err) {
                    // fire "user login error" event with the error massage
                    console.log(err);
                    $rootScope.$broadcast(EVENTS.USER_LOGIN_ERROR, err.data.error);
                }
            );
        };

        // user logout
        this.logout = function () {
            authFactory.logout().get(function (result) {
                if (result.state) {
                    // logged out 
                    $rootScope.$broadcast(EVENTS.USER_LOGGED_OUT);
                    localStorage.remove(CONFIG.TOKEN_STORE_KEY);
                }
            });
        };

    }
]);