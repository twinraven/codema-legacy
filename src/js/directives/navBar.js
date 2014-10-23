App.directive('navBar', [
    '$window',
    '$rootScope',
    'appStateService',
    function ($window, $rootScope, appStateService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'partials/nav-bar.html',
            link: function(scope, elem, attrs) {
                scope.headerElem = document.getElementById('js-logo');
                scope.headerHeight = scope.headerElem.offsetHeight;

                scope.getCurrentPage = appStateService.getCurrentPage;

                angular.element($window).bind('scroll', function() {
                    scope.$apply(function() {
                        if (this.pageYOffset > scope.headerHeight) {
                            $rootScope.fixedNav = true;

                        } else {
                            $rootScope.fixedNav = false;
                        }
                    });
                });

                angular.element($window).bind('resize', function() {
                    scope.headerHeight = scope.headerElem.offsetHeight;
                });
            }
        };
    }
]);