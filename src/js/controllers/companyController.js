App.controller('CompanyController', [
    '$scope',
    '$routeParams',
    'companiesService',
    function($scope, $routeParams, companiesService) {
        $scope.company = companiesService.getCompany($routeParams.companyId);

        $scope.editing = $routeParams.editing;

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