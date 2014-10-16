App.controller('CompanyAddCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    'contactsService',
    'companiesService',
    'appStateService',
    function($rootScope, $scope, $timeout, contactsService, companiesService, appStateService) {
         appStateService.setCurrentPage('add');

        $scope.type = 'companies';
        $scope.isEditing = true;
        $scope.getContact = contactsService.getContact;
        $scope.mode = 'new';
        $scope.company = {};
        $scope.company.contracts = [];

        $scope.saveCo = function() {
            companiesService.addCompany($scope.company);
            $location.path('/' + $scope.type);
        };

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function($index) {
            if (confirm('Are you sure?')) {
                $scope.company.contracts.splice($index, 1);
            }
        };

        $scope.selectContact = function(id) {
            $scope.company.contactId = id;
        };

        $scope.delayBlur = function() {
            $timeout(function() {
                $scope.showContacts = false;
            }, 250);
        };
    }
]);