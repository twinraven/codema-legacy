App.controller('CompanyEditCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$timeout',
    'dbService',
    'contactsService',
    'companiesService',
    'appStateService',
    function($rootScope, $scope, $routeParams, $timeout, dbService, contactsService, companiesService, appStateService) {
        appStateService.setCurrentPage('company');

        $scope.isEditing = $routeParams.editing;
        $scope.getContact = contactsService.getContact;
        $scope.id = $routeParams.companyId;
        $scope.type = 'companies';

        $scope.mode = 'show';

        // when the companies data updates, reset our scope variables accordingly. This is for when we load this page directly.
        // But if the db has already been polled (i.e. we've navigated to this page post-load), we're all good
        $scope.$on('dbCompaniesUpdated', setCompanyData);
        if (!dbService.isDbLoading()) { setCompanyData(); }

        function setCompanyData() {
            $scope.company = companiesService.getCompany($routeParams.companyId);
        }

        // scope methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $scope.addContract = function() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function(contractId) {
            if (confirm('Are you sure?')) {
                companiesService.removeContract($scope.company.id, contractId);
            }
        };

        $scope.deleteCo = function() {
            if (confirm('Are you sure?')) {
                companiesService.removeCompany($scope.company);
            }
        };

        $scope.selectContact = function(id) {
            $timeout(function() { $scope.company.contactId = id; });
            $scope.showContactList = false;
        };

        $scope.delayBlur = function() {
            $timeout(function() {
                $scope.showContacts = false;
            }, 250);
        };

        // auto-save data
        $scope.$watch('$scope.company', companiesService.saveCompanyData, true);

    }
]);