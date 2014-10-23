App.controller('PromptCtrl', [
    '$rootScope',
    '$scope',
    '$cookies',
    'dbService',
    'modalService',
    function($rootScope, $scope, $cookies, dbService, modalService) {
        $scope.yesDb = function() {
            dbService.dbAuth(true);
            modalService.hideModal(true);
        };

        $scope.noDb = function() {
            $cookies.preferenceIsOffline = true;
            dbService.setOfflinePreference(true);
            $cookies.preferenceExpires = (new Date()).getTime() + (14 * 24 * 60 * 60 * 1000); // days * hours * minutes * seconds * ms

            dbService.dbAuth(true);
            modalService.hideModal(true);
        };

        $scope.maybeLater = function() {
            $cookies.preferenceIsOffline = true;
            dbService.setOfflinePreference(true);
            $cookies.preferenceExpires = (new Date()).getTime();

            dbService.dbAuth(true);
            modalService.hideModal(true);
        };
    }
]);