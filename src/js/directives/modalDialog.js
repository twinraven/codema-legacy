App.directive('modalDialog', function () {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		controller: 'ModalDialogCtrl',
		templateUrl: 'partials/modal-dialog.html',
		link: function(scope, element, attrs) {}
	};
});