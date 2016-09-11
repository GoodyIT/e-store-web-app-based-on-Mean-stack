/**
 * this filter is used to shorten the product
 * description with a given number of words.
 */
bluStore.filter('descriptionMin', function(){
    "use strict";

    return function(input, limit){

        if(input.length > limit) {
            
            // reserve space for text ending "..."
            limit -= 3;

            var words = input.split(' ');
            var output = "";

            for (var i = 0; i < words.length; i++) {
                            
                if ((output.length + words[i].length + 1) <= limit) {
                    if (i > 0) output += ' '; // add space before every new word
                    output += words[i];
                }

            }

            output += '...';

            return output;

        }
        else {
            return input;
        }
        
    };
});