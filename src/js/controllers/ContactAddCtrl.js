App.controller('ContactAddCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    'contactsService',
    'appStateService',
    function($rootScope, $scope, $location, $routeParams, contactsService, appStateService) {
        appStateService.setCurrentPage('add');

        $scope.type = 'contacts';
        $scope.isEditing = true;
        $scope.mode = 'new';
        $scope.contact = {};

        function isDuplicateName(contacts, name) {
            return _.find(contacts, function(co) {
                return _.isEqual(co.name, name);
            });
        }

        $scope.saveCo = function() {
            var contacts = contactsService.getContacts();

            if (isDuplicateName(contacts, $scope.contact.name)) {
                if (confirm('You already have a contact by this name.\n\nClick \'OK\' to continue anyway;\nClick \'Cancel\' to edit this contact.')) {
                    contactsService.addContact($scope.contact);
                    $location.path('/' + $scope.type);
                } else {
                    return false;
                }
            } else {
                contactsService.addContact($scope.contact);
                $location.path('/' + $scope.type);
            }
        };
    }
]);