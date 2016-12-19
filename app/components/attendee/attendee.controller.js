angular.module('Attendee')
	.controller("AttendeeCtrl", AttendeeCtrl);

function AttendeeCtrl($scope, $timeout, DataAttendeeService, DataPresenterService, VotesService, QuestionsService, QuizService) {

// LOAD ATTENDEES
	$scope.attendees            = DataAttendeeService.attendees;
	//LOAD QUESTIONS
	$scope.questionsToPresenter = QuestionsService.questions;
	//LOAD VOTES
	$scope.votes                = VotesService.votes;
	//LOAD LIKE VOTES
	$scope.likeVotesArray       = VotesService.likeVotesArray;
	//LOAD DISLIKE VOTES
	$scope.dislikeVotesArray    = VotesService.dislikeVotesArray;
	//LOAD QUIZ QUESTIONS
	$scope.quizQuestion1        = QuizService.quizQuestion1;

	// bind the obj in view (presenter) to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	$scope.presenter = DataPresenterService.currentPresenterSyncObj;

	// bind the obj in view (attendee) to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataAttendeeService.currentAttendeeSyncObj.$bindTo($scope, 'attendee');
	// create the attendee on page arrival - Push the user to the database and start the session
	DataAttendeeService.currentAttendeeApiUrl.set(DataAttendeeService.defaultAttendee);

	//VOTES
	/////////////////////////////////////////////////////////////////////////
	// Create a function that when is clicked creates a LIKE vote Object in Firebase this is stored in an array
	$scope.voteLike = function() {
		$scope.attendee.vote = 'like';
		$scope.likeVotesArray.$add({
			user: $scope.attendee.$id,
			vote: 'like',
			value: 1,
			timestamp: Firebase.ServerValue.TIMESTAMP
		});
		// I have to disable to btn so people so not submit more than 1 vote per
		// interval
		$scope.disableSentimentBtns = true;
		$timeout(function() {
			$scope.disableSentimentBtns = false;
		}, 5000);
	};

	// Create a function that when is clicked creates a DISLIKE vote Object in Firebase this is stored in an array
	$scope.voteDislike = function() {
		$scope.attendee.vote = 'dislike';
		$scope.dislikeVotesArray.$add({
			user: $scope.attendee.$id,
			vote: 'dislike',
			value: 0,
			timestamp: Firebase.ServerValue.TIMESTAMP
		});
		// I have to disable to btn so people so not submit more than 1 vote per
		// interval
		$scope.disableSentimentBtns = true;
		$timeout(function() {
			$scope.disableSentimentBtns = false;
		}, 5000);
	};




	//WATCHING ATTENDEE OBJECT
	// ///////////////////////////////////////////////////////////////////////
	// Create a watch to watch what happens on the Attendees node
	$scope.$watch('attendees', function(newVal, oldVal) {

		// Panic Button Logic
		// $scope.panicButton = function(attendee) {
		// 	if ($scope.attendee.feeling == "fine") {
		// 		$scope.attendee.feeling = "panic";
		// 	} else if ($scope.attendee.feeling == "panic") {
		// 		$scope.attendee.feeling = "fine";
		// 	}
		// };// Panic Button Logic

		$scope.numOfPeopleWithVoteAttribute = _.filter($scope.attendees, function(attendee) {
			return attendee.vote;
		});

		$scope.numOfPeopleWithDislikeVotes = _.filter($scope.attendees, function(attendee) {
			return attendee.vote === 'dislike';
		});

		if(!$scope.dislikePercent) { $scope.dislikePercent = 0 }

		$scope.dislikePercent = Math.round(($scope.numOfPeopleWithDislikeVotes.length / $scope.numOfPeopleWithVoteAttribute.length) * 100);

		displayYolko()
	}, true);


	// Create a watch to watch what happens on the Votes node
	$scope.$watch('votes', function(newVal, oldVal) {

		//TODO: Have to put logoc to make sure that if there is only one person participating I still see a good face.
		// Start counting the dislikePercentage() when there are more than 5 people with Vote Attribute
		// displayYolko();
	}, true);


	//Displaying Yolko
	$scope.avatar = { face:'assets/avatars/great-icon.svg', message: 'Yolko is great' };

	function displayYolko() {
		if($scope.dislikePercent >= 80) {
				return $scope.avatar = {face: 'assets/avatars/tense-full-face.svg', message: 'Yolko is a little tense', backgroundColor: 'lever-5-mood-color'};
		} else if ($scope.dislikePercent >= 60 && $scope.dislikePercent <= 79.999999999999) {
				return $scope.avatar = {face: 'assets/avatars/notsogood-full-face.svg', message: 'Yolko is not so good', backgroundColor: 'lever-4-mood-color'};
		} else if ($scope.dislikePercent >= 40 && $scope.dislikePercent <= 59.999999999999) {
				return $scope.avatar = {face: 'assets/avatars/serious-full-face.svg', message: 'Yolko is ok', backgroundColor: 'lever-3-mood-color'};
		} else if ($scope.dislikePercent >= 20 && $scope.dislikePercent <= 39.999999999999) {
				return $scope.avatar = {face: 'assets/avatars/great-full-face.svg', message: 'Yolko is great', backgroundColor: 'lever-2-mood-color'};
		} else if ($scope.dislikePercent >= 0 && $scope.dislikePercent <= 29.999999999999) {
				return $scope.avatar = {face: 'assets/avatars/motivated-full-face.svg', message: 'Yolko is motivated!', backgroundColor: 'lever-1-mood-color'};
		} else {
			return $scope.avatar = { face:'assets/avatars/great-full-face.svg', message: 'Yolko is great', backgroundColor: 'lever-2-mood-color' };
		}

		// $scope.burnt              = $scope.dislikePercent >= 76;
		// $scope.shocked            = $scope.dislikePercent >= 64 && $scope.dislikePercent <= 75.999999999999;
		// $scope.idontgetit         = $scope.dislikePercent >= 56 && $scope.dislikePercent <= 63.999999999999;
		// $scope.startingtonotgetit = $scope.dislikePercent >= 48 && $scope.dislikePercent <= 55.999999999999;
		// $scope.tastey             = $scope.dislikePercent >= 40 && $scope.dislikePercent <= 47.999999999999;
		// $scope.want               = $scope.dislikePercent >= 32 && $scope.dislikePercent <= 39.999999999999;
		// $scope.confident          = $scope.dislikePercent >= 24 && $scope.dislikePercent <= 31.999999999999;
		// $scope.igotthis           = $scope.dislikePercent >= 16 && $scope.dislikePercent <= 23.999999999999;
		// $scope.laughing           = $scope.dislikePercent < 15.999999999999 || isNaN($scope.dislikePercent);
		// $scope.zzz                = $scope.dislikePercent === 0 || 'NaN';
	}





















	//QUIZ
	// ///////////////////////////////////////////////////////////////////////
	$scope.submitAnswer = function () {
		if ($scope.attendee.chosenAnswer === "A") {
			QuizService.quizAnswers1A.$add(1);
		} else if ($scope.attendee.chosenAnswer === "B") {
			QuizService.quizAnswers1B.$add(1);
		} else if ($scope.attendee.chosenAnswer === "C") {
			QuizService.quizAnswers1C.$add(1);
		} else if ($scope.attendee.chosenAnswer === "D") {
			QuizService.quizAnswers1D.$add(1);
		}
		//disbale all other answers after attendee submits their answers
		if($scope.attendee.chosenAnswer) {
			$scope.disableAllChoices = true;
		} else {
			alert('Hey! Choose an option... ')
		}
	};





	$scope.$watch('quizQuestion1', function(newVals, oldVals) {
		var answersA = QuizService.quizAnswers1A.length;
		var answersB = QuizService.quizAnswers1B.length;
		var answersC = QuizService.quizAnswers1C.length;
		var answersD = QuizService.quizAnswers1D.length;

		var chartAllData = {
			labels: ['A', 'B', 'C', 'D'],
			series: [answersA, answersB, answersC, answersD]
		};

		var chartBarOptions = {
			distributeSeries: true,
			axisY: {
				onlyInteger: true
			}
		};

		// Create a new bar chart object where as first parameter we pass in a selector
		// that is resolving to our chart container element. The Second parameter
		// is the actual data object and the third the options.
		new Chartist.Bar('.ct-chart', chartAllData, chartBarOptions);

		//Shows the quiz on the UI of the attendee when the Pop Qui is fired from the Dashboard
		$scope.showQuiz = $scope.quizQuestion1.isShowingQuiz;
		//Shows the quiz on the UI of the attendee when the Pop Qui is fired from the Dashboard
		$scope.isShowingResultsToPresenter = $scope.quizQuestion1.isShowingResultsToPresenter;
	}, true);

	//QUESTIONS TO THE PRESENTER
	// ///////////////////////////////////////////////////////////////////////
	$scope.addQuestionKeyDown = function(event) {
		if (event.keyCode === 13 && $scope.questionContent) {
			$scope.questionsToPresenter.$add({
				content: $scope.questionContent,
				counter: 0,
				time: Firebase.ServerValue.TIMESTAMP
			});
			$scope.questionContent = "";
		}
	};

	$scope.addQuestionClick = function() {
		if($scope.questionContent) {
			$scope.questionsToPresenter.$add({
				content: $scope.questionContent,
				counter: 0,
				time: Firebase.ServerValue.TIMESTAMP
			});
		}
		$scope.questionContent = "";
	};

	$scope.removeQuestion = function(key) {
		$scope.questionsToPresenter.$remove(key);
	};


	$scope.voteQuestionUp = function(questionToPresenter) {
		questionToPresenter.counter++;
		QuestionsService.questions.$save(questionToPresenter);
		console.log('questionToPresenter', questionToPresenter)
	};

	// $scope.voteQuestionDown = function(questionToPresenter) {
	// 	questionToPresenter.counter--;
	// 	QuestionsService.questions.$save(questionToPresenter);
	// };

}