// App initialisation
var App = angular.module('Codema', ['ngRoute']); //, 'dropstore-ng'

App.run([
    '$rootScope',
    '$routeParams',
    'dbService',
    'companiesService',
    function($rootScope, $routeParams, dbService, companiesService) {
        $rootScope.companies = companiesService.getCompanies();
        $rootScope.isLoading = false;
        $rootScope.isLoginStateInFlux = false;

        $rootScope.logout = dbService.dbLogout;
        $rootScope.login = dbService.dbLogin;

        $rootScope.dbActive = false;

        // keep up to date with the login status, app-wide
        $rootScope.$watch(
            dbService.getDbLoginStatus,

            function(newVal, oldVal) {
                $rootScope.dbActive = newVal;
            });

        // make sure we're always up to date with the companies list,
        // as async changes happen for Dropbox comms
        $rootScope.$watch(
            companiesService.getCompanies,

            function(newVal) {
                $rootScope.companies = newVal;
            }, true);
    }
]);