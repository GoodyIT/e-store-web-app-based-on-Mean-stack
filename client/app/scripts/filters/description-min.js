/**
 * this filter is used to shorten the product
 * description with a given number of words.
 */
bluStore.filter('descriptionMin', function(){
    "use strict";

    return function(input, descLength){
        var words = input.split(' ');
        var output = "";

        if(descLength < words.length) {

            for (var i = 0; i < descLength; i++) {
                output += words[i] + " ";
            }

            output += "...";
        }
        else{
            output = input;
        }

        return output;
    };
});