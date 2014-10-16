/* Companies Service */

App.service('appStateService', [
    '$rootScope',
    function($rootScope) {
        var methods = {},
            currentPage = null;

        methods.getCurrentPage = function getCurrentPage() {
            return currentPage;
        };

        methods.setCurrentPage = function setCurrentPage(page) {
            currentPage = page;
        };

        return methods;
    }
]);
