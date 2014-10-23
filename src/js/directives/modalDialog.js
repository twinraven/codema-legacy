App.directive('modalDialog', [
'modalService',
	function (modalService) {
		return {
			restrict: 'E',
			scope: false,
			replace: true,
			transclude: true,
			templateUrl: 'partials/modal-dialog.html',

			link: function(scope, element, attrs) {
				scope.hideModal = modalService.hideModal;
				scope.isModalShown = modalService.isModalShown;
				scope.getActiveModalId = modalService.getActiveModalId;
				scope.isCloseBtnHidden = modalService.isCloseBtnHidden;

				if (scope.hideModalCloseBtn){
					modalService.setCloseBtnHidden(true);
				}
			}
		};
	}
]);