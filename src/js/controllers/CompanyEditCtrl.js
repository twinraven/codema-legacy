App.controller('CompanyEditCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$timeout',
    '$location',
    'dbService',
    'contactsService',
    'companiesService',
    'appStateService',
    'modalService',
    function($rootScope, $scope, $routeParams, $timeout, $location, dbService, contactsService, companiesService, appStateService, modalService) {
        appStateService.setCurrentPage('companies');

        $scope.isEditing = $routeParams.editing;
        $scope.getContact = contactsService.getContact;
        $scope.showModal = modalService.showModal;
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

        $scope.addContract = function addContract() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function removeContract(contractId) {
            if (confirm('Are you sure?')) {
                companiesService.removeContract($scope.company.id, contractId);
            }
        };

        $scope.deleteCo = function deleteCo() {
            if (confirm('Are you sure?')) {
                companiesService.removeCompany($scope.company);
                $location.path('/' + $scope.type);
            }
        };

        $scope.selectContact = function selectContact(id) {
            $timeout(function() {
                $scope.company.contactId = id;
                $scope.company.contactName =  id !== null ? $scope.getContact(id).name : null;
            });
            $scope.showContactList = false;
        };

        $scope.delayBlur = function delayBlur() {
            $timeout(function() {
                $scope.showContacts = false;
            }, 250);
        };

        $scope.finishEditing = function finishEditing() {
            if ($scope.coForm.$valid) {
                $location.search('editing', null);
            } else {
                alert('Please fix the errors in the form before continuing');
            }
        };

        // auto-save data
        $scope.$watch('$scope.company', function() {
            if ($scope.company) {
                companiesService.saveCompanyData();

                if ($scope.company.contracts) {
                    $scope.company.contracts = companiesService.removeEmptyContracts($scope.company.contracts);
                }
            }
        }, true);

    }
]);