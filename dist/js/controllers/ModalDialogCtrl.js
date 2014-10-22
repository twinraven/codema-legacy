App.controller('ModalDialogCtrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    function($rootScope, $scope, $timeout) {
        $scope.modalShown = false;

        $rootScope.showModal = function() {
            $timeout(function() { $scope.modalShown = true; });
            $rootScope.$broadcast('modalOpened');
        };

        $rootScope.hideModal = function(force) {
            if (force || !$scope.hideModalCloseBtn) {
                $timeout(function() { $scope.modalShown = false; });
                $rootScope.$broadcast('modalClosed');
            }
        };

        $rootScope.getModalState = function() {
            return $scope.modalShown;
        };
    }
]);