bluStore.factory('categoriesFactory', function () {
    'use strict';

    return {

        categories:  [
            {
                _id: "asjdh92130daskdlaqpopos8712",
                name: "electronics",
                children: [
                    {
                        name: "tv"
                    },
                    {
                        name: "computers"
                    }
                ]
            },
            {
                _id: "asjdh92130daskdlasasdas8712",
                name: "books",
                children: [
                    {
                        name: "science"
                    },
                    {
                        name: "math"
                    }
                ]
            }
        ]

    };
});