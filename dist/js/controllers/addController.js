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
            companiesService.removeContract($scope.company.id, $index);
        };
    }
]);

App.controller('ContactController', ['$scope', 'companiesService',
    function($scope, companiesService) {
        $scope.companies = companiesService.getCompanies();

        $scope.contacts = _.uniq(_.pluck($scope.companies, 'contactName'));

        $scope.companiesByContact = _.groupBy($scope.companies, function(obj) {
            return obj.contactName;
        });
    }
]);
