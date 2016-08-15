bluStore.factory('productsFactory', function () {
    'use strict';

    return {

        products: [
            {
                name: "Asus laptop",
                category: {
                    _id: "asjdh92130daskdlaqpopos8712",
                    name: "electronics"
                },
                image: "images/laptop.jpg",
                description: "Morbi at lacinia sapien, eget sodales elit. Vestibulum in dapibus ipsum, at luctus nisi." +
                " Cras eget diam ut dolor placerat pellentesque. Etiam in arcu diam.",
                isNew: true,
                price: 5000,
                stock: 10
            },
            {
                name: "hp laptop",
                category: {
                    _id: "asjdh92130daskdlaqpopos8712",
                    name: "electronics"
                },
                image: "images/laptop2.png",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                price: 5000,
                stock: 10
            },
            {
                name: "matrix pc 240",
                category: {
                    _id: "",
                    name: "computers - pc"
                },
                image: "images/pc.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                isNew: true,
                price: 5000,
                stock: 10
            },
            {
                name: "king stone FD",
                category: {
                    _id: "",
                    name: "Memory"
                },
                image: "images/flash-drive.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                isSale: true,
                price: 5000,
                stock: 10
            },
            {
                name: "PS4",
                category: {
                    _id: "",
                    name: "Game station"
                },
                image: "images/ps4.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                price: 5000,
                stock: 10
            },
            {
                name: "Xbox One",
                category: {
                    _id: "",
                    name: "Game station"
                },
                image: "images/xbox-one.png",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                price: 5000,
                stock: 10
            },
            {
                name: "Hard Disk Drive",
                category: {
                    _id: "",
                    name: "Memory"
                },
                image: "images/hdd.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                isNew: true,
                price: 5000,
                stock: 10
            },
            {
                name: "DDR3",
                category: {
                    _id: "",
                    name: "Memory"
                },
                image: "images/ram.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                isSale: true,
                price: 5000,
                stock: 10
            },
            {
                name: "iPhone 6s",
                category: {
                    _id: "asjdh92130daskdlasasdas8712",
                    name: "books"
                },
                image: "images/iphone.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et bibendum velit.",
                price: 5000,
                stock: 10
            }
        ],
        getByCategoryId: function(id){
            return this.products.filter(function(obj){
                return obj.category._id.toString() === id.toString();
            });
        }

    };
});