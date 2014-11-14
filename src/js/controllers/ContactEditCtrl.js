App.controller('ContactEditCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$timeout',
    '$location',
    'dbService',
    'contactsService',
    'companiesService',
    'appStateService',
    function($rootScope, $scope, $routeParams, $timeout, $location, dbService, contactsService, companiesService, appStateService) {
         appStateService.setCurrentPage('contacts');

        $scope.isEditing = $routeParams.editing;
        $scope.id = parseInt($routeParams.contactId);
        $scope.type = 'contacts';
        $scope.mode = 'show';

        // when the contacts data updates, reset our scope variables accordingly. This is for when we load this page directly.
        // But if the db has already been polled (i.e. we've navigated to this page post-load), we're all good
        $scope.$on('dbContactsUpdated', setContactData);
        if (!dbService.isDbLoading()) { setContactData(); }

        function setContactData() {
            $scope.contact = contactsService.getContact($routeParams.contactId);
        }

        // scope methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $scope.deleteCo = function deleteCo() {
            if (confirm('Are you sure?')) {
                companiesService.removeContactFromCompanies($scope.id);
                contactsService.removeContact($scope.contact);
                $location.path('/' + $scope.type);
            }
        };

        $scope.finishEditing = function finishEditing() {
            if ($scope.coForm.$valid) {
                $location.search('editing', null);
            } else {
                alert('Please fix the errors in the form before continuing');
            }
        };

        // auto-save data
        $scope.$watch('$scope.contact', contactsService.saveContactData, true);

    }
]);