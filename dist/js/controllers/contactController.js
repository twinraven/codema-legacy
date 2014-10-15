App.controller('ContactController', [
    '$rootScope',
    '$scope',
    'companiesService',
    function($rootScope, $scope, companiesService) {
        $rootScope.page = 'contacts';

        // when the companies data updates, reset our scope variables accordingly
        $rootScope.$watch(companiesService.getCompanies, setContactData, true);


        function setContactData() {
            $scope.companiesWithContact = companiesService.getCompaniesWithContact();
            $scope.contacts = companiesService.getContacts();

            // will be 0, or less
            $scope.companiesNotDisplayed = $rootScope.companies.length - $scope.companiesWithContact.length;

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

            $scope.companiesByContact = _.groupBy($scope.companiesWithContact, function(obj) {
                return obj.contactName;
            });
        }
    }
]);