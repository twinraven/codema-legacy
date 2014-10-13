App.controller('AddController', ['$scope', 'companiesService',
    function($scope, companiesService) {

        $scope.company = {};
        $scope.company.contracts = [];

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
    }
]);