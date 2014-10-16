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

        // when the companies data updates, reset our scope variables accordingly. This is for when we load this page directly.
        // But if the db has already been polled (i.e. we've navigated to this page post-load), we're all good
        $scope.$on('dbCompaniesUpdated', setContactData);
        if (!dbService.isDbLoading()) { setContactData(); }

        function setContactData() {
            $scope.companiesWithContact = companiesService.getCompaniesWithContact();
            $scope.contacts = contactsService.getContacts();

            // will be 0, or more
            $scope.companiesNotDisplayed = $scope.companies.length - $scope.companiesWithContact.length;

            // do as directive perhaps
            if ($scope.companiesNotDisplayed === 1) {
                $scope.companiesSuffix = 'y';
                $scope.companiesDescriptor = 'is';
            } else {
                $scope.companiesSuffix = 'ies';
                $scope.companiesDescriptor = 'are';
            }

            $scope.companiesByContact = _.groupBy($scope.companiesWithContact, function(obj) {
                return obj.contactName;
            });
        }
    }
]);