'use strict';

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$httpProvider','$routeProvider','$locationProvider', function($httpProvider,$routeProvider,$locationProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.
        when('/', {
            templateUrl: 'views/login.html'
            //controller: 'UserListCtrl'
        }).
        when('/signout', {
            templateUrl: 'views/login.html'
            //controller: 'UserListCtrl'
        }).
        when('/signup', {
            templateUrl: 'views/register.html'
            //controller: 'UserListCtrl'
        }).
        when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UserCtrl'
        }).
        when('/category/add', {
            templateUrl: 'views/category/form.html',
            controller: 'CategoryCtrl'
        }).
        when('/home', {
            templateUrl: 'views/home.html'
            //controller: 'UserListCtrl'
        }).
        otherwise({
            redirectTo: '/api'
        });

    $locationProvider.html5Mode(true);

}]);