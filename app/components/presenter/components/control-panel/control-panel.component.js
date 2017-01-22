angular.module('Presenter')
.component('ogControlPanel', {
	templateUrl: "components/presenter/components/control-panel/control-panel.html",
	controller: ogControlPanelCtrl,
	bindings: {
		presenters: '=',
		presenter: '='
	}
});

function ogControlPanelCtrl(ResetService) {
	var vm = this;

	vm.yolkoEval = function() {
		vm.presenter.yolkoIsActive = !vm.presenter.yolkoIsActive;

		if(!vm.presenter.yolkoIsActive) {
			ResetService.resetYolko();
		}
	};

	vm.lostEval = function() {
		vm.presenter.lostIsActive = !vm.presenter.lostIsActive;

		if(!vm.presenter.lostIsActive) {
			ResetService.resetPanicTracker();
		}
	};

	vm.questionsEval = function() {
		vm.presenter.questionsIsActive = !vm.presenter.questionsIsActive;
	};

	vm.speedEval = function() {
		vm.presenter.speedIsActive = !vm.presenter.speedIsActive;

		if(!vm.presenter.speedIsActive) {
			ResetService.resetSpeedTracker();
		}
	};

	vm.hearingEval = function() {
		vm.presenter.hearingIsActive = !vm.presenter.hearingIsActive;

		if(!vm.presenter.hearingIsActive) {
			ResetService.resetVolumeTracker();
		}
	};

	vm.customQuestionToAttendeesEval = function() {
		vm.presenter.customQuestionToAttendeesIsActive = !vm.presenter.customQuestionToAttendeesIsActive;

		if(vm.presenter.customQuestionToAttendeesIsActive) {
			ResetService.resetCustomQuestion();
		}

		if( vm.presenter.selectedQuestionForAttendees.questionData.isShowingResultsToAttendees ) {
			vm.presenter.selectedQuestionForAttendees.questionData.isShowingResultsToAttendees = false;
		}
	};

}