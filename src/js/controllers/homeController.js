App.controller('HomeController', [
    '$scope',
    'companiesService',
    function($scope, companiesService) {
        /*var ref = new Firebase("https://dazzling-torch-6890.firebaseio.com/data");

        var sync = $firebase(ref);

        // download the data into a local object
        var syncObject = sync.$asObject();

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "data");*/

        $scope.companies = companiesService.getCompanies();

    }
]);