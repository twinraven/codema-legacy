App.directive('headerBar', [
    'appStateService',
    function (appStateService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/header-bar.html',
            link: function(scope, elem, attrs) {
                scope.getCurrentPage = appStateService.getCurrentPage;
            }
        };
    }
]);