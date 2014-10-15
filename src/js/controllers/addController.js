App.controller('AddController', [
    '$rootScope',
    '$scope',
    '$timeout',
    'companiesService',
    function($rootScope, $scope, $timeout, companiesService) {
        $rootScope.page = 'add';
        $scope.mode = 'new';
        $scope.isEditing = true;

        $scope.company = {};
        $scope.company.contracts = [];

        $scope.$watch(
            companiesService.getCompanies,

            function(newVal, oldVal) {
                $scope.contacts = companiesService.getContacts();
            }, true);

        $scope.saveCompany = function() {
            companiesService.addCompany($scope.company);
        };

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function($index) {
            if (confirm('Are you sure?')) {
                $scope.company.contracts.splice($index, 1);
            }
        };

        $scope.selectContact = function(contact) {
            $scope.company.contactName = contact;
            $scope.showContacts = false;
        }

        $scope.delayBlur = function() {
            $timeout(function() {
                $scope.showContacts = false;
            }, 250);
        };
    }
]);