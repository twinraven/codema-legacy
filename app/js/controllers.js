'use strict';

/* Controllers */

angular.module('Codema.controllers', [])
  .controller('HomeController', [
    '$scope',
    /*'$firebase',*/
    'companiesService',

    function($scope, /*$firebase,*/ companiesService) {
        /*var ref = new Firebase("https://dazzling-torch-6890.firebaseio.com/data");

        var sync = $firebase(ref);

        // download the data into a local object
        var syncObject = sync.$asObject();

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");*/

        $scope.companies = companiesService.getCompanies();


  }])
  .controller('CompanyController', [
    '$scope',
    '$routeParams',
    'companiesService',

    function($scope, $routeParams, companiesService) {
        $scope.company = companiesService.getCompany($routeParams.companyId);

        $scope.editing = $routeParams.editing;

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function($index) {
            $scope.company.contracts.splice($index,1);
        };

  }])
  .controller('AddController', [
    '$scope',
    'companiesService',

    function($scope, companiesService) {

        $scope.company = {};
        $scope.company.contracts = [];

        $scope.saveCompany = function() {
            companiesService.addCompany($scope.company);
        };

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function($index) {
            $scope.company.contracts.splice($index,1);
        };
  }]);
