App.controller('CompanyListCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$routeParams',
    'appStateService',
    'dbService',
    'contactsService',
    function($rootScope, $scope, $timeout, $routeParams, appStateService, dbService, contactsService) {
        appStateService.setCurrentPage('companies');

        // move this to appCtrl?
        // Problem: different modals on same page. need to be able to call 'showModal' with params
        $rootScope.$on('showAuthModal', function() {
            $timeout(function() {
                $rootScope.showModal();
            }, 1000);
        });

        dbService.dbAuth(false);

        $scope.getContact = contactsService.getContact;

        $scope.filterText = $routeParams.search;
    }
]);