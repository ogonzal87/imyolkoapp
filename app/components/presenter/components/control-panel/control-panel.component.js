angular.module('Presenter')
.component('ogControlPanel', {
	templateUrl: "components/presenter/components/control-panel/control-panel.html",
	controller: ogControlPanelCtrl,
	bindings: {
		presenters: '=',
		presenter: '='
	}
});

function ogControlPanelCtrl($scope, DataPresenterService) {


}