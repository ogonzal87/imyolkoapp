angular.module('Presenter')
.controller('PresenterCtrl', PresenterCtrl);

function PresenterCtrl(FIREBASE_URL, $scope, VotesService, QuestionsToPresenterService, DataAttendeeService, DataPresenterService, ResetService) {

	var vm = this;

	//LOAD ATTENDEES
	//$scope here because of the $bindTo from Firebase and the $scope.$watch
	$scope.attendees                 = DataAttendeeService.attendees;
	//LOAD QUESTIONS
	vm.allQuestionsFromAttendees     = QuestionsToPresenterService.questions;
	//LOAD VOTES
	vm.votes                         = VotesService.votes;
	//LOAD LIKE VOTES
	vm.likeVotesArray                = VotesService.likeVotesArray;
	//LOAD DISLIKE VOTES
	vm.dislikeVotesArray             = VotesService.dislikeVotesArray;
	//LOAD CUSTOM QUESTIONS ARRAY
	vm.customQuestionsToAttendeesArr = DataPresenterService.customQuestionsToAttendeesArr;

	//$scope here because of the $bindTo from Firebase
	$scope.presenter                 = DataPresenterService.currentPresenterSyncObj;

	vm.selectedQuestionForAttendees  = DataPresenterService.selectedQuestionForAttendees;

	//bind the obj in view (presenter) to the database in Firebase
	//any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataPresenterService.currentPresenterSyncObj.$bindTo($scope, 'presenter');
	DataPresenterService.currentPresenterApiUrl.set(DataPresenterService.defaultPresenter);

	//bind the obj in view (quizQuestion1) to the database in Firebase
	//any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataPresenterService.answersForSelectedQuestionForAttendeesObj.$bindTo($scope, 'answersForSelectedQuestionForAttendeesObj');


	//WATCHING ALL EVENTS UNDER THE ATTENDEES NODE IN FIREBASE --> to have 3-way data binding working.
	$scope.$watch('attendees', function(newVal, oldVal) {
		vm.numAttendees = $scope.attendees.length;

		//Volume Percentage
		// /////////////////////////////////////////////////////////////////////////
		var volumeUpAttendees = _.filter($scope.attendees, function(attendee) {
			return attendee.volumeUp == "yes";
		});
		vm.volumeUpPercent = volume(Math.round((volumeUpAttendees.length / vm.numAttendees) * 100));

		//Speed Percentage
		///////////////////////////////////////////////////////////////////////////
		var speedValue = _.reduce($scope.attendees, function(memo, attendee) {
			return memo + attendee.speed;
		}, 0);

		vm.speedPercent = speed(Math.round((speedValue / vm.numAttendees) * 100));

		//Lost Percentage
		// /////////////////////////////////////////////////////////////////////////
		var lostValues = _.filter($scope.attendees, function(attendee) {
			return attendee.feeling == "panic";
		});
		vm.panicPercent = panic(Math.round((lostValues.length / vm.numAttendees) * 100));

		//dislike percentage
		//////////////////////////////////////////////////////////////////////////
		vm.numOfPeopleWithVoteAttribute = _.filter($scope.attendees, function(attendee) {
			return attendee.vote;
		});
		vm.numOfPeopleWithDislikeVotes = _.filter($scope.attendees, function(attendee) {
			return attendee.vote === 'dislike';
		});
		if(!vm.dislikePercent) { vm.dislikePercent = 0 }

		vm.dislikePercent = Math.round((vm.numOfPeopleWithDislikeVotes.length / vm.numOfPeopleWithVoteAttribute.length) * 100);

		// displays the mood of the class in the Dashboard with avatar's face
		displayYolkoInDashboard();

		//QUESTIONS TO PRESENTER
		// /////////////////////////////////////////////////////////////////////////
		vm.questionsToPresenter = vm.allQuestionsFromAttendees;

		vm.removeQuestion = function(key) {
			vm.questionsToPresenter.$remove(key);
		};

		// _.each($scope.attendees, function(attendee) {
		// 	_.each(attendee.questions, function(question) {
		// 		vm.allQuestionsFromAttendees.push({
		// 			content: question.content,
		// 			name: attendee.name
		// 		});
		// 	});
		// });

		//show chart for the VOLUME
		new Chartist.Pie('.ct-chart-volume', {
			series: [vm.volumeUpPercent, 100]
		}, {
			donut: true,
			donutWidth: 40,
			startAngle: 0,
			height: 254,
			width: 254,
			total: 100,
			showLabel: false
		});

		//show chart for the SPEED
		new Chartist.Pie('.ct-chart-speed', {
			series: [45, 100]
		}, {
			donut: true,
			donutWidth: 40,
			startAngle: 0,
			height: 254,
			width: 254,
			total: 100,
			showLabel: false
		});

		//show chart for the LOST
		new Chartist.Pie('.ct-chart-lost', {
			series: [vm.panicPercent.content, 100]
		}, {
			donut: true,
			donutWidth: 40,
			startAngle: 0,
			height: 254,
			width: 254,
			total: 100,
			showLabel: false
		});
	}, true);

	//DISPLAYING YOLKO
	vm.avatarDashboard = { face:'assets/icons/dash-sleeping.svg', backgroundColor: 'lever-0-mood-color' };
	function displayYolkoInDashboard() {
		if(vm.dislikePercent >= 80) {
			return vm.avatarDashboard = {face: 'assets/icons/dash-tense.svg', message: 'Yolko is a little tense'};
		} else if (vm.dislikePercent >= 60 && vm.dislikePercent <= 79.999999999999) {
			return vm.avatarDashboard = {face: 'assets/icons/dash-notsogood.svg', message: 'Yolko is not so good'};
		} else if (vm.dislikePercent >= 40 && vm.dislikePercent <= 59.999999999999) {
			return vm.avatarDashboard = {face: 'assets/icons/dash-serious.svg', message: 'Yolko is ok'};
		} else if (vm.dislikePercent >= 20 && vm.dislikePercent <= 39.999999999999) {
			return vm.avatarDashboard = {face: 'assets/icons/dash-great.svg', message: 'Yolko is great'};
		} else if (vm.dislikePercent >= 0 && vm.dislikePercent <= 29.999999999999) {
			return vm.avatarDashboard = {face: 'assets/icons/dash-motivated.svg', message: 'Yolko is motivated!'};
		} else {
			return vm.avatarDashboard = { face:'assets/icons/dash-sleeping.svg'};
		}
	}

	//DISPLAYING VOLUME PERCENTAGE
	function volume(percent) {
		if (percent > 10) {
			return { value: percent, content: percent, class: 'dashboard-bad-color' };
		} else {
			return { value: percent, content: percent, class: '' };
		}
	}

	//DISPLAYING SPEED INDICATOR
	function speed(percent) {
		if (percent > 20) {
			return { value: percent, content: 'Go Faster', class: 'is-active-circle-too-fast' };
		} else if (percent < -20) {
			return { value: percent,  content: 'Go Slower', class: 'is-active-circle-too-slow' };
		} else {
			return { value: percent, content: "We are good", class: 'is-active-circle-we-good' };
		}
	}

	//DISPLAYING LOST/PANIC PERCENT
	function panic(percent) {
		return { content: percent };
	}




	//CUSTOM QUESTION MAKER
	///////////////////////////////////////////////////////////////////////////

	//constructor to create a Custom Question for Attendees
	function CustomQuestion(content, availAnswers, correctAnsw, questionData) {
		this.key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
		this.questionContent = content;
		this.availAnswers = availAnswers;
		this.correctAnsw = correctAnsw || '';
		this.questionData = questionData;
	}

	//arr containing al the questions that the presenter has created to ask the attendees
	vm.questionsForAttendees = [];

	vm.saveQuestionForAttendees = function() {
		vm.showCustomQuestionMaker = false;
		var questionData = {
			isShowingQuiz: true,
			isShowingResultsToAttendees: false,
			isShowingResultsToPresenter: true,
		};

		var options = [{a: vm.customQuestion.optionA || ''}, {b: vm.customQuestion.optionB || ''}, {c: vm.customQuestion.optionC || ''}];
		var question = new CustomQuestion(vm.customQuestion.content, options, vm.customQuestion.correctAnsw, questionData);

		// Set the questions in Firebase in an array.
		var newQuestionRef = new Firebase(FIREBASE_URL + 'presenter/customQuestionsToAttendees/' + question.key);
		newQuestionRef.set(question);

		vm.customQuestion.content = '';
		vm.customQuestion.correctAnsw = '';
		vm.customQuestion.optionA = '';
		vm.customQuestion.optionB = '';
		vm.customQuestion.optionC = '';
	};


	vm.selectQuestionToAttendees = function (question) {
		$scope.presenter.selectedQuestionForAttendees = question;
		vm.addClassToSelected = question.key;
	};


	//RESULTS FROM THE CUSTOM QUESTION SELECTED BY THE PRESENTER
	////////////////////////////////////////////////////////////////////////////
	$scope.$watch('answersForSelectedQuestionForAttendeesObj', function(newVals, oldVals) {
		vm.numOfAnswersFromAttendees = DataPresenterService.choiceAForSelectedQuestionForAttendees.length + DataPresenterService.choiceBForSelectedQuestionForAttendees.length + DataPresenterService.choiceCForSelectedQuestionForAttendees.length;

		var answersA = DataPresenterService.choiceAForSelectedQuestionForAttendees.length;
		var answersB = DataPresenterService.choiceBForSelectedQuestionForAttendees.length;
		var answersC = DataPresenterService.choiceCForSelectedQuestionForAttendees.length;

		var chartAllData = {
			labels: ['A', 'B', 'C'],
			series: [answersA, answersB, answersC]
		};

		var chartBarOptions = {
			distributeSeries: true,
			axisY: {
				onlyInteger: true
			},
			width: 700,
			height: 350,
		};

		// Create a new bar chart object where as first parameter is the selector
		// that is resolving to our chart container element in the view. The Second parameter
		// is the actual data object and the third the options for the view of the Chart.
		new Chartist.Bar('.ct-chart-customQuestionsToAttendees', chartAllData, chartBarOptions);
	}, true);



	//RESET CONTROLS
	////////////////////////////////////////////////////////////////////////////
	//Floating Btn to hard reset the presentation on the Presenter page
	vm.openFab = function() {
		vm.isActive = !vm.isActive;
	};
	vm.resetVolumeTracker  = ResetService.resetVolumeTracker; //sets to default values
	vm.resetSpeedTracker   = ResetService.resetSpeedTracker; //sets to default values
  vm.resetYolko          = ResetService.resetYolko; //deletes the Votes node
  vm.resetPanicTracker   = ResetService.resetPanicTracker; //sets to default values
  vm.resetEverything     = ResetService.resetEverything; //deletes the Votes and Questionn nodes in the database but sets the values of the attendees back to start
  vm.deleteEverything    = ResetService.deleteEverything; //delets all the nodes in the Database
}
