/**
 * this filter will take a products array
 * and turn it into products matrix
 * depended on the number of allowed columns
 * in every row in bootstrap grid system.
 * @param gridsInRow -> the max number of
 * columns that one row can take.
 */
bluStore.filter('productsGrid', function(){
    "use strict";

    return function(products, gridsInRow) {

        var output = [];

        for (var i = 0; i < products.length; i += gridsInRow){
            var tempArray = [];
            for(var x = 0; x < gridsInRow; x++){
                if((i+x) < products.length)
                    tempArray.push(products[i + x]);
            }
            output.push(tempArray);
        }

        return output;

    };

});