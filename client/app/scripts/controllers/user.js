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
    this.userImage = '';
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
                that.userImage = result.userData.imageUrl;
                that.isAdmin = result.userData.isAdmin;

                // debug
                console.log(result);

            },
            function(err){
                // on login error
                if(err.data.error === 'user_not_found'){

                }
                else if (err.data.error === 'invalid_password') {

                }

                //debug
               console.log(err);
            }
        );
    };

}]);