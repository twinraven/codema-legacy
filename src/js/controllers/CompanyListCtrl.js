App.controller('CompanyListCtrl', [
    '$rootScope',
    '$scope',
    'appStateService',
    function($rootScope, $scope, appStateService) {
        appStateService.setCurrentPage('companies');
    }
]);