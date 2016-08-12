"use strict";

var bluStore = angular.module('bluStore', ['ui.router']);

bluStore.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, redirect to /index
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: "views/main.html",
            controller: "mainCtrl"
        });

});