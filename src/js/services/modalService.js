App.service('modalService', [
    '$rootScope',
    '$timeout',
    function($rootScope, $timeout) {
        var methods = {},
            modalShown = false,
            activeModalId = null,
            hideCloseBtn = false;

        methods.showModal = function showModal(id) {
            $timeout(function() { modalShown = true; });

            activeModalId = id;
            $rootScope.$broadcast('modalOpened');
        };

        methods.hideModal = function hideModal(force) {
            if (force || !hideCloseBtn) {
                $timeout(function() { modalShown = false; });
                $rootScope.$broadcast('modalClosed');
            }
        };

        methods.isModalShown = function isModalShown() {
            return modalShown;
        };

        methods.getActiveModalId = function getActiveModalId() {
            return activeModalId;
        };

        methods.setActiveModalId = function setActiveModalId(id) {
            activeModalId = id;
        };

        methods.setCloseBtnHidden = function setCloseBtnHidden(bool) {
            hideCloseBtn = bool;
        };

        methods.isCloseBtnHidden = function isCloseBtnHidden() {
            return hideCloseBtn;
        };

        return methods;
    }
]);