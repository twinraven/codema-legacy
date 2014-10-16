App.controller('ContactEditCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$timeout',
    'dbService',
    'contactsService',
    'appStateService',
    function($rootScope, $scope, $routeParams, $timeout, dbService, contactsService, appStateService) {
         appStateService.setCurrentPage('contacts');

        $scope.isEditing = $routeParams.editing;
        $scope.id = $routeParams.contactId;
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

        $scope.deleteCo = function() {
            if (confirm('Are you sure?')) {
                contactsService.removeContact($scope.contact);
            }
        };

        // auto-save data
        $scope.$watch('$scope.contact', contactsService.saveContactData, true);

    }
]);