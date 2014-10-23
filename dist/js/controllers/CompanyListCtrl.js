App.controller('CompanyListCtrl', [
    '$scope',
    '$routeParams',
    'appStateService',
    'contactsService',
    function($scope, $routeParams, appStateService, contactsService) {
        appStateService.setCurrentPage('companies');

        $scope.getContact = contactsService.getContact;

        $scope.filterText = $routeParams.search;
    }
]);