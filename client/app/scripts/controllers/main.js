bluStore.controller('mainCtrl', ['$scope', '$rootScope', '$state', '$filter', 'categoriesFactory', 'productsFactory', 'Upload', 'API',
    function ($scope, $rootScope, $state, $filter, categories, products, Upload, API) {
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
        that.register = function () {
            //check if from is valid
            if (that.rgForm.$valid && that.rgPic) {
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


        /** START: Categories List */

        /**
         * get all categories and set them to the scope
         * to use in the navbar
         */

        var categoriesList = [];
        that.categories = [];

        // get categories tree from server 
        categories.getAll().get(function (result) {
            // set categories list to local var
            categoriesList = result.data;

            // set the list on the root scope for later use without reloading
            $rootScope.categoriesList = categoriesList;

            that.displayCategory("root");
        });

        that.displayCategory = function (category, back) {

            if (category === "root") {
                // cleare search input
                that.cateSearchTerm = "";
                
                // filter categories dropdown to show only root categories  
                that.categories = categoriesList.filter(function (obj) {
                    return !obj.parent;
                });
                return;
            }

            // by default use category id to display sub categories "children"
            var parentId = category._id;

            // if backward requested 
            if (back) {
                // cleare search input
                that.cateSearchTerm = "";
                // find parent's parent "to go back"
                parentId = categoriesList.find(function (obj) {
                    return obj._id === category.parent;
                }).parent;
            }

            var children = [];
            var output = [];

            if (parentId) {
                // get parent's children categories "array of categories ids"
                children = categoriesList.find(function (obj) {
                    return obj._id === parentId;
                }).children;
                
                // parse children ids to get categories data
                output = categoriesList.filter(function (obj) {
                    return children.find(function (child) {
                        return child == obj._id;
                    });
                });
            }
            else {
                // the parent was the root category so it has no parent
                output = categoriesList.filter(function (obj) {
                    return !obj.parent;
                });
            }

            // set filtered categories to the view
            that.categories = output;

        };

        /** END: Categories List */

        // delete product by it's ID
        $rootScope.deleteProduct = function (id) {
            products.deleteById(id).remove(
                function (result) {
                    $state.reload(); // reload state after deleting a product
                }
            );
        };

    }]
);
