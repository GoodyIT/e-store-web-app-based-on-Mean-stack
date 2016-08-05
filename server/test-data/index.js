'use strict';

var mongoose = require('mongoose');
var config = require('../config');
var colors = require('colors/safe');
mongoose.Promise = require('bluebird');
var dataLoader = require('./data-Loader');

var arg = process.argv[2];

var models;
var Category;
// connnect to database
mongoose.connect(config.MONGODB);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log(err);
});

db.once('open', function () {

    models = require('../models');
    Category = models.Category;
    
    if (arg === 'load') {
        loadData();
    }
    else if (arg === 'clear') {
        clearData(function(){
            process.exit(1);
        });
    }
    else {
        clearData(function(){
            loadData();
        });
    }

});

function loadData() {
    // load Categories
    dataLoader.loadCategories(Category, null,function(err, categories){
        
        if (err) {
            console.log(err);
        }

        var num = colors.yellow.bold('\n\t' + categories.length);
        var msg = colors.green.bold(' - Categories Loaded to Database!\n');
        console.log(num + msg);
        db.close();
    });
}



function clearData(done) {
    models.Category.remove({}, function (err) {
        if (err) throw err;

        console.log(colors.red.bold('\n\t* categories db cleaned!\n'));

        models.Product.remove({}, function (err) {
            if (err) throw err;

            console.log(colors.red.bold('\t* products db cleaned!\n'));

            done();
        });
    });
}