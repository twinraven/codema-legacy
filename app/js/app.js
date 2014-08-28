'use strict';


// Declare app level module which depends on filters, and services
angular.module('Codema', [
  'ngRoute',
  /*'firebase',*/
  'Codema.filters',
  'Codema.services',
  'Codema.directives',
  'Codema.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
  $routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: 'AddController'});
  $routeProvider.when('/company/:companyID', {templateUrl: 'partials/company.html', controller: 'CompanyCtrl'});
  $routeProvider.when('/contact/:contactID', {templateUrl: 'partials/contact.html', controller: 'ContactCtrl'});
  $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapCtrl'});*/
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
