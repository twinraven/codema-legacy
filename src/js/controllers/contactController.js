App.controller('ContactController', ['$scope', 'companiesService',
    function($scope, companiesService) {
        $scope.companies = companiesService.getCompanies();
        $scope.companiesWithContact = _.filter($scope.companies, function(obj) {
            return obj.contactName;
        });

        // will be 0, or less
        $scope.companiesNotDisplayed = $scope.companies.length - $scope.companiesWithContact.length;

        // force a boolean, for ng-show/hide on .item-hidden-message
        $scope.hasContactsWithoutContact = !!$scope.companiesNotDisplayed;

        // do as directive perhaps
        if ($scope.companiesNotDisplayed === 1) {
            $scope.companiesSuffix = 'y';
            $scope.companiesDescriptor = 'is';
        } else {
            $scope.companiesSuffix = 'ies';
            $scope.companiesDescriptor = 'are';
        }

        $scope.contacts = _.uniq(_.pluck($scope.companiesWithContact, 'contactName'));

        $scope.companiesByContact = _.groupBy($scope.companiesWithContact, function(obj) {
            return obj.contactName;
        });
    }
]);