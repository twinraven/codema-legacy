App.controller('ContactListCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'dbService',
    'contactsService',
    'companiesService',
    'appStateService',
    function($rootScope, $scope, $routeParams, dbService, contactsService, companiesService, appStateService) {
         appStateService.setCurrentPage('contacts');

        $scope.contactId = $routeParams.contactId;
        $scope.getCompaniesByContact = companiesService.getCompaniesByContact;

        // when the companies data updates, reset our scope variables accordingly. This is for when we load this page directly.
        // But if the db has already been polled (i.e. we've navigated to this page post-load), we're all good
        $scope.$on('dbCompaniesUpdated', setContactData);
        if (!dbService.isDbLoading()) { setContactData(); }

        function setContactData() {
            $scope.companiesWithContact = companiesService.getCompaniesWithContact();
            $scope.contacts = contactsService.getContacts();
        }

        $scope.getSuffix = function getSuffix(num) {
            if (num === 1) {
                return 'y';
            } else {
                return 'ies';
            }
        };

        $scope.clearFilter = function clearFilter() {
            $scope.filterText = "";
        }
    }
]);