/* Directives */

App.directive('dbControls', function () {
    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        templateUrl: 'partials/db-controls.html'
    };
});

App.directive('editBar', function () {
    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        templateUrl: 'partials/edit-bar.html',
        link: function(scope, elem, attrs) {
            scope.pos = attrs.pos;
        }
    };
});