/// App Controller
App.controller('AppCtrl', [
    '$rootScope',
    '$scope',
    'dbService',
    'contactsService',
    'companiesService',
    '$location',
    function ($rootScope, $scope, dbService, contactsService, companiesService, $location) {
        $scope.isDbLoading = dbService.isDbLoading;

        $scope.companies = companiesService.getCompanies();
        $scope.contacts = contactsService.getContacts();

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