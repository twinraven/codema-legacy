App.controller('CompanyAddCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$location',
    'contactsService',
    'companiesService',
    'appStateService',
    'modalService',
    function($rootScope, $scope, $timeout, $location, contactsService, companiesService, appStateService, modalService) {
        appStateService.setCurrentPage('add');

        $scope.type = 'companies';
        $scope.isEditing = true;
        $scope.getContact = contactsService.getContact;
        $scope.showModal = modalService.showModal;
        $scope.mode = 'new';
        $scope.company = {};
        $scope.company.contracts = [];

        $scope.saveCo = function saveCo() {
            if ($scope.coForm.$invalid) {
                alert('Please fix the errors in the form before continuing');

            } else {
                if ($scope.company.contracts) {
                    $scope.company.contracts = companiesService.removeEmptyContracts($scope.company.contracts);
                }
                companiesService.addCompany($scope.company);
                $location.path('/' + $scope.type);
            }
        };

        $scope.cancelCo = function cancelCo() {
            $location.path('/' + $scope.type);
        };

        $scope.addContract = function addContract() {
            $scope.company.contracts.push({});
        };

        $scope.removeContract = function removeContract($index) {
            if (confirm('Are you sure?')) {
                $scope.company.contracts.splice($index, 1);
            }
        };

        $scope.selectContact = function selectContact(id) {
            $scope.company.contactId = id;
            $scope.company.contactName = $scope.getContact(id).name;
            $scope.showContactList = false;
        };

        $scope.delayBlur = function delayBlur() {
            $timeout(function() {
                $scope.showContacts = false;
            }, 250);
        };
    }
]);