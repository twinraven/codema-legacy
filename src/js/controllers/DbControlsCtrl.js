App.controller('DbControlsCtrl', [
    '$rootScope',
    '$scope',
    'dbService',
    function($rootScope, $scope, dbService) {
        // db-controls needs its own controller
        $scope.logout = dbService.dbLogOut;
        $scope.login = dbService.dbLogIn;
        $scope.isOnline = dbService.isOnline;
        $scope.isLoginStatusInFlux = dbService.isLoginStatusInFlux;

        $scope.dbActive = false;

        // -- put this in the controller above --
        $scope.$watch(
            dbService.isDbLoggedIn,

            function(newVal, oldVal) {
                $scope.dbActive = newVal;
            });
    }
]);