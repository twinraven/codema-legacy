/// App Controller
App.controller('AppCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$location',
    'dbService',
    'contactsService',
    'companiesService',
    'modalService',
    function ($rootScope, $scope, $timeout, $location, dbService, contactsService, companiesService, modalService) {
        $scope.isDbLoading = dbService.isDbLoading;

        $scope.companies = companiesService.getCompanies();
        $scope.contacts = contactsService.getContacts();

        $rootScope.$on('showAuthModal', function() {
            $timeout(function() {
                modalService.showModal('promptModal');
            }, 1000);
        });


        $rootScope.$on('modalOpened', function() {
            $timeout(function () {
                $scope.isModalOpen = true;
            });
        });

        $rootScope.$on('modalClosed', function() {
            $timeout(function () {
                $scope.isModalOpen = false;
            });
        });

        dbService.dbAuth(false);

        // make sure we're always up to date with the companies list, which is request async from Dropbox
        $scope.$watch(
            companiesService.getCompanies,

            function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.companies = newVal;
                    $scope.$broadcast('dbCompaniesUpdated');
                }
            }, true);

        // also watch contacts for changes
        $scope.$watch(
            contactsService.getContacts,

            function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.contacts = newVal;
                    $scope.$broadcast('dbContactsUpdated');
                }
            }, true);

    }
]);