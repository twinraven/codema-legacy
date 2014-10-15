App.controller('CompanyController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'companiesService',
    function($rootScope, $scope, $routeParams, companiesService) {
        $rootScope.page = 'company';

        if ($routeParams.companyId) {
            $scope.mode = 'show';
        }
        if ($routeParams.editing) {
            $scope.isEditing = true;
        }

        $scope.company = companiesService.getCompany($routeParams.companyId);
        $scope.$watch(
            companiesService.getCompanies,

            function(newVal, oldVal) {
                $scope.company = companiesService.getCompany($routeParams.companyId);
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

        $scope.$watch('$scope.company', companiesService.saveCompanyData, true);

    }
]);