angular.module('Presenter')
.component('ogControlPanel', {
	templateUrl: "components/presenter/components/control-panel/control-panel.html",
	controller: ogControlPanelCtrl,
	bindings: {
		presenters: '=',
		presenter: '='
	}
});

function ogControlPanelCtrl() {
	var vm = this;

	vm.yolkoEval = function() {
		vm.presenter.yolkoIsActive = !vm.presenter.yolkoIsActive;
	};

	vm.lostEval = function() {
		vm.presenter.lostIsActive = !vm.presenter.lostIsActive;
	};

	vm.questionsEval = function() {
		vm.presenter.questionsIsActive = !vm.presenter.questionsIsActive;
	};

	vm.speedEval = function() {
		vm.presenter.speedIsActive = !vm.presenter.speedIsActive;
	};

	vm.hearingEval = function() {
		vm.presenter.hearingIsActive = !vm.presenter.hearingIsActive;
	};

	vm.customQuestionToAttendeesEval = function() {
		vm.presenter.customQuestionToAttendees = !vm.presenter.customQuestionToAttendees
	};

}