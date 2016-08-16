bluStore.controller('userCtrl', ['authFactory' ,function (authFactory) {
    'use strict';

    var that = this;

    this.userEmail = '';
    this.password = '';
    this.keepInfo = false;
    this.isLoggedIn = false;
    this.firstName = '';
    this.lastName = '';
    this.fullName = '';
    this.isAdmin = false;

    this.login = function () {
        authFactory.login(that.userEmail, that.password).then(
            function(result){
                // on login success
                that.password = '';
                that.firstName = result.userData.firstName;
                that.lastName = result.userData.lastName;
                that.isLoggedIn = true;
                that.fullName = that.firstName + ' ' + that.lastName;
                that.isAdmin = result.userData.isAdmin;
                console.log(result);

            },
            function(err){
               console.log(err);
            }
        );
    };

}]);