bluStore.controller('mainCtrl', ['$scope', '$rootScope', '$state', '$filter', 'categoriesFactory', 'productsFactory', 'Upload', 'API',
    function($scope, $rootScope, $state, $filter, categories, products, Upload, API){
        "use strict";

        // pointer to the scope for internal use.
        var that = this;
        
        // loading state 
        $rootScope.stateLoading = {
            app: false,
            content: false,
            admin: false
        };

        /** START: Register Modal */

        that.passwordMatch = function () {
            return that.rgPass === that.rgPass2;
        };

        //function to call on form submit
        that.register = function() {
            //check if from is valid
            if(that.rgForm.$valid && that.rgPic) {
                //call upload function
                that.upload(that.rgPic);
            }
        };

        that.upload = function (file) {
            Upload.upload({
                url: API.USER_REGISTER,
                data: {
                    file: file,
                    username: that.rgEmail,
                    firstname: that.rgFname,
                    lastname: that.rgLname,
                    password: that.rgPass
                }
            }).then(function (resp) {
                if (resp.data.state === true) {
                    that.rgEmail = "";
                    that.rgFname = "";
                    that.rgLname = "";
                    that.rgPass = "";
                    that.rgPass2 = "";
                    that.rgProgress = 0;
                    that.rgPic = "";
                    that.rgForm.$setPristine();
                    that.rgMessage = resp.data.message;
                    that.rgMsgErr = false;
                }
                else {
                    that.rgMessage = resp.data.message;
                    that.rgMsgErr = true;
				}
            },
            function (resp) {
                that.rgMessage = resp.data.message;
                that.rgMsgErr = true;
			},
			function (evt) {
				// capture upload progress
				that.rgProgress = parseInt(100.0 * evt.loaded / evt.total);
			});
        };

        /** END: Register Modal */

        /** START: Routing Events */
        /**
         * register event to track view changes and
         * reflect it on the navbar which is connected
         * via activeView variable
         */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            //console.log("toState: " + toState.name + " - fromState: " + fromState);
            that.activeView = toState.name;

            if (toState.name === 'app') {
                $rootScope.stateLoading.app = true;
                that.showHeader = true;
            }
            else if (toState.name === 'app.admin') {
                // make sure admin is logged in before move to admin page
                if (!$rootScope.isLoggedIn || !$rootScope.isAdmin) {
                    event.preventDefault();
                }
                else {
                    $rootScope.stateLoading.app = true;
                    that.showHeader = false;
                }
            }
            else {
                that.showHeader = false;
            }
        });

        $rootScope.$on('$stateChangeError', function(){
            $rootScope.stateLoading.app = false;
            $rootScope.stateLoading.content = false;
            $rootScope.stateLoading.admin = false;
        });
        $rootScope.$on('$stateNotFound', function(event, unFoundState){
            $rootScope.stateLoading.app = false;
            $rootScope.stateLoading.content = false;
            $rootScope.stateLoading.admin = false;
        });

        $rootScope.$on('$viewContentLoading');
        $rootScope.$on('$viewContentLoaded', function() {
        });

        $rootScope.$on('$stateChangeSuccess', function(){
            
        });

        /** END: Routing Events */


        /** START: Global Actions */

        /**
         * get all categories and set them to the scope
         * to use in the navbar
         */        
        categories.getAll('tree').get(function(result){
            that.categories = result.data;
        });

        that.selectedCate = function (cateName) {
            console.log(cateName);
        };

        // delete product by it's ID
        $rootScope.deleteProduct = function (id) {
            products.deleteById(id).remove(
                function(result){
                    $state.reload(); // reload state after deleting a product
                }
            );
		};

        /** END: Global Actions */

    }]
);
