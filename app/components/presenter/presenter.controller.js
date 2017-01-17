angular.module('Presenter')
.controller('PresenterCtrl', PresenterCtrl);

function PresenterCtrl(FIREBASE_URL, $scope, VotesService, QuestionsToPresenterService, DataAttendeeService, DataPresenterService, ResetService, QuizService) {
	//LOAD ATTENDEES
	$scope.attendees                     = DataAttendeeService.attendees;
	//LOAD QUESTIONS
	$scope.allQuestionsFromAttendees     = QuestionsToPresenterService.questions;
	//LOAD VOTES
	$scope.votes                         = VotesService.votes;
	//LOAD LIKE VOTES
	$scope.likeVotesArray                = VotesService.likeVotesArray;
	//LOAD DISLIKE VOTES
	$scope.dislikeVotesArray             = VotesService.dislikeVotesArray;
	//LOAD CUSTOM QUESTIONS OBJECT
	$scope.customQuestionsToAttendees    = QuizService.customQuestionsToAttendees;
	//LOAD CUSTOM QUESTIONS ARRAY
	$scope.customQuestionsToAttendeesArr = QuizService.customQuestionsToAttendeesArr;

	$scope.presenter                     = DataPresenterService.currentPresenterSyncObj;

	$scope.selectedQuestionForAttendees  = DataPresenterService.selectedQuestionForAttendees;

	//bind the obj in view (presenter) to the database in Firebase
	//any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataPresenterService.currentPresenterSyncObj.$bindTo($scope, 'presenter');
	DataPresenterService.currentPresenterApiUrl.set(DataPresenterService.defaultPresenter);

	//bind the obj in view (quizQuestion1) to the database in Firebase
	//any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataPresenterService.answersForSelectedQuestionForAttendeesObj.$bindTo($scope, 'answersForSelectedQuestionForAttendeesObj');


	//WATCHING ALL EVENTS UNDER THE ATTENDEES NODE IN FIREBASE --> to have 3-way data binding working.
	$scope.$watch('attendees', function(newVal, oldVal) {
		$scope.numAttendees = $scope.attendees.length;

		//Volume Percentage
		// /////////////////////////////////////////////////////////////////////////
		var volumeUpAttendees = _.filter($scope.attendees, function(attendee) {
			return attendee.volumeUp == "yes";
		});
		$scope.volumeUpPercent = volume(Math.round((volumeUpAttendees.length / $scope.numAttendees) * 100));

		//Speed Percentage
		///////////////////////////////////////////////////////////////////////////
		var speedValue = _.reduce($scope.attendees, function(memo, attendee) {
			return memo + attendee.speed;
		}, 0);
		$scope.speedPercent = speed(Math.round((speedValue / $scope.numAttendees) * 100));

		//Lost Percentage
		// /////////////////////////////////////////////////////////////////////////
		var lostValues = _.filter($scope.attendees, function(attendee) {
			return attendee.feeling == "panic";
		});
		$scope.panicPercent = panic(Math.round((lostValues.length / $scope.numAttendees) * 100));

		//dislike percentage
		//////////////////////////////////////////////////////////////////////////
		$scope.numOfPeopleWithVoteAttribute = _.filter($scope.attendees, function(attendee) {
			return attendee.vote;
		});
		$scope.numOfPeopleWithDislikeVotes = _.filter($scope.attendees, function(attendee) {
			return attendee.vote === 'dislike';
		});
		if(!$scope.dislikePercent) { $scope.dislikePercent = 0 }

		$scope.dislikePercent = Math.round(($scope.numOfPeopleWithDislikeVotes.length / $scope.numOfPeopleWithVoteAttribute.length) * 100);

		// displays the mood of the class in the Dashboard with avatar's face
		displayYolkoInDashboard();

		//QUESTIONS TO PRESENTER
		// /////////////////////////////////////////////////////////////////////////
		$scope.questionsToPresenter = $scope.allQuestionsFromAttendees;

		$scope.removeQuestion = function(key) {
			$scope.questionsToPresenter.$remove(key);
		};

		// _.each($scope.attendees, function(attendee) {
		// 	_.each(attendee.questions, function(question) {
		// 		$scope.allQuestionsFromAttendees.push({
		// 			content: question.content,
		// 			name: attendee.name
		// 		});
		// 	});
		// });

		//show chart for the VOLUME
		new Chartist.Pie('.ct-chart-volume', {
			series: [$scope.volumeUpPercent, 100]
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
			series: [$scope.panicPercent.content, 100]
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
	$scope.avatarDashboard = { face:'assets/icons/dash-sleeping.svg', backgroundColor: 'lever-0-mood-color' };
	function displayYolkoInDashboard() {
		if($scope.dislikePercent >= 80) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-tense.svg', message: 'Yolko is a little tense'};
		} else if ($scope.dislikePercent >= 60 && $scope.dislikePercent <= 79.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-notsogood.svg', message: 'Yolko is not so good'};
		} else if ($scope.dislikePercent >= 40 && $scope.dislikePercent <= 59.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-serious.svg', message: 'Yolko is ok'};
		} else if ($scope.dislikePercent >= 20 && $scope.dislikePercent <= 39.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-great.svg', message: 'Yolko is great'};
		} else if ($scope.dislikePercent >= 0 && $scope.dislikePercent <= 29.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-motivated.svg', message: 'Yolko is motivated!'};
		} else {
			return $scope.avatarDashboard = { face:'assets/icons/dash-sleeping.svg'};
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

	//DISPLAYING SPEED IDICATOR
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
	function CustomQuestion(content, availAnswers, correctAnsw, questionData) {
		this.key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
		this.questionContent = content;
		this.availAnswers = availAnswers;
		this.correctAnsw = correctAnsw || '';
		this.questionData = questionData;
	}

	$scope.questionsForAttendees = [];

	$scope.saveQuestionForAttendees = function() {
		$scope.showCustomQuestionMaker = false;
		var questionData = {
			isShowingQuiz: true,
			isShowingResultsToAttendees: false,
			isShowingResultsToPresenter: true,
		};

		var options = [{a: $scope.customQuestion.optionA || ''}, {b: $scope.customQuestion.optionB || ''}, {c: $scope.customQuestion.optionC || ''}];
		var question = new CustomQuestion($scope.customQuestion.content, options, $scope.customQuestion.correctAnsw, questionData);

		// Set the question in Firebase
		var newQuestionRef = new Firebase(FIREBASE_URL + '/customQuestionsToAttendees/' + question.key);
		newQuestionRef.set(question);

		$scope.customQuestion.content = '';
		$scope.customQuestion.correctAnsw = '';
		$scope.customQuestion.optionA = '';
		$scope.customQuestion.optionB = '';
		$scope.customQuestion.optionC = '';
	};


	$scope.selectQuestionToAttendees = function (question) {
		$scope.presenter.selectedQuestionForAttendees = question;
		$scope.addClassToSelected = question.key;
	};




	//RESULTS FROM THE CUSTOM QUESTION SELECTED BY THE PRESENTER
	////////////////////////////////////////////////////////////////////////////
	$scope.$watch('answersForSelectedQuestionForAttendeesObj', function(newVals, oldVals) {
		$scope.numOfAnswersFromAttendees = DataPresenterService.choiceAForSelectedQuestionForAttendees.length + DataPresenterService.choiceBForSelectedQuestionForAttendees.length + DataPresenterService.choiceCForSelectedQuestionForAttendees.length;

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

		//Shows the quiz on the UI of the attendee when the Pop Qui is fired from the Dashboard
		$scope.isShowingResultsToPresenter = $scope.customQuestionsToAttendees.isShowingResultsToPresenter;
	}, true);




	//RESET CONTROLS
	////////////////////////////////////////////////////////////////////////////
	$scope.openFab = function() {
		$scope.isActive = !$scope.isActive;
	};
	$scope.resetVolumeTracker  = ResetService.resetVolumeTracker; //sets to default values
	$scope.resetSpeedTracker   = ResetService.resetSpeedTracker; //sets to default values
  $scope.resetYolko          = ResetService.resetYolko; //deletes the Votes node
  $scope.resetPanicTracker   = ResetService.resetPanicTracker; //sets to default values
  $scope.resetEverything     = ResetService.resetEverything; //deletes the Votes and Questionn nodes in the database but sets the values of the attendees back to start
  $scope.deleteEverything    = ResetService.deleteEverything; //delets all the nodes in the Database
}
