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
  .controller('AddController', [
    '$scope',
    /*'$firebase',*/
    'companiesService',

    function($scope, /*$firebase,*/ companiesService) {

  }]);
