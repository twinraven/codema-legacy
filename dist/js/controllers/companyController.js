App.controller('CompanyController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$timeout',
    'companiesService',
    function($rootScope, $scope, $routeParams, $timeout, companiesService) {
        $rootScope.page = 'company';

        if ($routeParams.companyId) {
            $scope.mode = 'show';
        }
        if ($routeParams.editing) {
            $scope.isEditing = true;
        }

        $scope.$watch(
            companiesService.getCompanies,

            function(newVal, oldVal) {
                $scope.company = companiesService.getCompany($routeParams.companyId);
                $scope.contacts = companiesService.getContacts();
            }, true);


        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function(contractId) {
            if (confirm('Are you sure?')) {
                companiesService.removeContract($scope.company.id, contractId);
            }
        };

        $scope.deleteCompany = function() {
            if (confirm('Are you sure?')) {
                companiesService.removeCompany($scope.company);
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

        $scope.$watch('$scope.company', companiesService.saveCompanyData, true);

    }
]);