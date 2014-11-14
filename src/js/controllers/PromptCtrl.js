App.controller('PromptCtrl', [
    '$rootScope',
    '$scope',
    '$cookies',
    'dbService',
    'modalService',
    function($rootScope, $scope, $cookies, dbService, modalService) {
        $scope.yesDb = function yesDb() {
            dbService.dbAuth(true);
            modalService.hideModal(true);
        };

        $scope.noDb = function noDb() {
            $cookies.preferenceIsOffline = true;
            dbService.setOfflinePreference(true);
            $cookies.preferenceExpires = (new Date()).getTime() + (14 * 24 * 60 * 60 * 1000); // days * hours * minutes * seconds * ms

            dbService.dbAuth(true);
            modalService.hideModal(true);
        };

        $scope.maybeLater = function maybeLater() {
            $cookies.preferenceIsOffline = true;
            dbService.setOfflinePreference(true);
            $cookies.preferenceExpires = (new Date()).getTime();

            dbService.dbAuth(true);
            modalService.hideModal(true);
        };
    }
]);