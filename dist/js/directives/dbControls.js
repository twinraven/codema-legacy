App.directive('dbControls', function () {
    return {
        controller: 'DbControlsCtrl',
        restrict: 'E',
        replace: 'true',
        scope: true,
        templateUrl: 'partials/db-controls.html'
    };
});
