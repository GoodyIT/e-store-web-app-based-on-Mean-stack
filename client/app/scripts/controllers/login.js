bluStore.controller('loginCtrl', ['authFactory' ,function (authFactory) {
    'use strict';

    var that = this;

    this.userEmail = '';
    this.password = '';
    this.keepInfo = false;

    this.login = function () {
        authFactory.login(that.userEmail, that.password).then(
            function(result){
                console.log(result);
            },
            function(err){
               console.log(err);
            }
        );
    }

}]);