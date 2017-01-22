angular.module('Attendee')
	.controller("AttendeeCtrl", AttendeeCtrl);

function AttendeeCtrl($scope, $timeout, DataAttendeeService, DataPresenterService, VotesService, QuestionsToPresenterService) {

	var vm = this;

// LOAD ATTENDEES
	//$scope here because of the $bindTo from Firebase and the $scope.$watch
	$scope.attendees        = DataAttendeeService.attendees;
	//LOAD QUESTIONS
	vm.questionsToPresenter = QuestionsToPresenterService.questions;
	//LOAD VOTES
	vm.votes                = VotesService.votes;
	//LOAD LIKE VOTES
	vm.likeVotesArray       = VotesService.likeVotesArray;
	//LOAD DISLIKE VOTES
	vm.dislikeVotesArray    = VotesService.dislikeVotesArray;

	// bind the obj in view (presenter) to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	vm.presenter = DataPresenterService.currentPresenterSyncObj;


	// bind the obj in view (attendee) to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	DataAttendeeService.currentAttendeeSyncObj.$bindTo($scope, 'attendee');
	// create the attendee on page arrival - Push the user to the database and start the session
	DataAttendeeService.currentAttendeeApiUrl.set(DataAttendeeService.defaultAttendee);


	// bind the obj in view (answersForSelectedQuestionForAttendeesObj) to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	// this one in particular, is to display the responses on the Graph when the presenter reveals the graph
	DataPresenterService.answersForSelectedQuestionForAttendeesObj.$bindTo($scope, 'answersForSelectedQuestionForAttendeesObj');

	//VOTES
	/////////////////////////////////////////////////////////////////////////
	// creates a LIKE vote Object in Firebase stored in an array
	vm.voteLike = function() {
		$scope.attendee.vote = 'like';
		vm.likeVotesArray.$add({
			user: $scope.attendee.$id,
			vote: 'like',
			value: 1,
			timestamp: Firebase.ServerValue.TIMESTAMP
		});
		// Disable to btn so people so not submit more than 1 vote per interval
		vm.disableSentimentBtns = true;
		$timeout(function() {
			vm.disableSentimentBtns = false;
		}, 5000);
	};

	// creates a DISLIKE vote Object in Firebase. This is stored in an array
	vm.voteDislike = function() {
		$scope.attendee.vote = 'dislike';
		vm.dislikeVotesArray.$add({
			user: $scope.attendee.$id,
			vote: 'dislike',
			value: 0,
			timestamp: Firebase.ServerValue.TIMESTAMP
		});
		// Disable to btn so people so not submit more than 1 vote per interval
		vm.disableSentimentBtns = true;
		$timeout(function() {
			vm.disableSentimentBtns = false;
		}, 5000);
	};




	//WATCHING ATTENDEE OBJECT
	// ///////////////////////////////////////////////////////////////////////
	// Create a watch to watch what happens on the Attendees node
	$scope.$watch('attendees', function(newVal, oldVal) {

		//LOST LOGIC
		vm.attendeeInPanic = function () {
			$scope.attendee.feeling = 'panic';
		};
		vm.attendeeNotInPanic = function () {
			$scope.attendee.feeling = 'fine';
		};

		//HEARING LOGIC
		vm.attendeeCannotHear = function () {
			$scope.attendee.volumeUp = 'yes';
		};
		vm.attendeeCanHear = function () {
			$scope.attendee.volumeUp = 'no';
		};

		//SPEED LOGIC
		vm.attendeeWantSlower = function () {
			$scope.attendee.speed = -1;
		};
		vm.attendeeWantFaster = function () {
			$scope.attendee.speed = 1;
		};

		// find how many people have voted from the total amount of attendees
		vm.numOfPeopleWithVoteAttribute = _.filter($scope.attendees, function(attendee) {
			return attendee.vote;
		});

		// find how many people have voted DISLIKE from the total amount of attendees
		vm.numOfPeopleWithDislikeVotes = _.filter($scope.attendees, function(attendee) {
			return attendee.vote === 'dislike';
		});

		if(!vm.dislikePercent) { vm.dislikePercent = 0 }

		//**LOGIC THAT DRIVES YOLKO DISPLAYING**//
		vm.dislikePercent = Math.round((vm.numOfPeopleWithDislikeVotes.length / vm.numOfPeopleWithVoteAttribute.length) * 100);
		displayYolko();
	}, true);


	//Displaying Yolko
	vm.avatarDeactive = { face:'assets/avatars/sleeping-face.svg' };

	function displayYolko() {
		if(vm.dislikePercent >= 80) {
			return vm.avatar = {face: 'assets/avatars/tense-full-face.svg', message: 'Yolko is a little tense'};
		} else if (vm.dislikePercent >= 60 && vm.dislikePercent <= 79.999999999999) {
			return vm.avatar = {face: 'assets/avatars/notsogood-full-face.svg', message: 'Yolko is not so good'};
		} else if (vm.dislikePercent >= 40 && vm.dislikePercent <= 59.999999999999) {
			return vm.avatar = {face: 'assets/avatars/serious-full-face.svg', message: 'Yolko is ok'};
		} else if (vm.dislikePercent >= 20 && vm.dislikePercent <= 39.999999999999) {
			return vm.avatar = {face: 'assets/avatars/great-full-face.svg',	message: 'Yolko is great'};
		} else if (vm.dislikePercent >= 0 && vm.dislikePercent <= 29.999999999999) {
			return vm.avatar = {face: 'assets/avatars/motivated-full-face.svg', message: 'Yolko is motivated!'};
		} else {
			return vm.avatar = {face: 'assets/avatars/great-full-face.svg', message: 'Yolko is great'};
		}
	}



	//CUSTOM QUESTION
	// ///////////////////////////////////////////////////////////////////////
	vm.submitAnswer = function () {
		if ($scope.attendee.chosenAnswer === "A") {
			DataPresenterService.choiceAForSelectedQuestionForAttendees.$add(1);
		} else if ($scope.attendee.chosenAnswer === "B") {
			DataPresenterService.choiceBForSelectedQuestionForAttendees.$add(1);
		} else if ($scope.attendee.chosenAnswer === "C") {
			DataPresenterService.choiceCForSelectedQuestionForAttendees.$add(1);
		}
		//disable all other answers after attendee submits their answers
		$scope.attendee.submittedChosenAnswer = true;
	};


	//Answers Chart that come from the view of the Meeting Page after the custom question is fired
	$scope.$watch('answersForSelectedQuestionForAttendeesObj', function(newVals, oldVals) {
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

		// Create a new bar chart object where as first parameter we pass in a selector
		// that is resolving to our chart container element. The Second parameter
		// is the actual data object and the third the options.
		new Chartist.Bar('.ct-chart-customQuestionsToAttendeesMeeting', chartAllData, chartBarOptions);
	}, true);


	//QUESTIONS TO THE PRESENTER
	/////////////////////////////////////////////////////////////////////////
	vm.addQuestionKeyDown = function(event) {
		if (event.keyCode === 13 && vm.questionContent) {
			vm.questionsToPresenter.$add({
				content: vm.questionContent,
				counter: 0,
				time: Firebase.ServerValue.TIMESTAMP
			});
			vm.questionContent = "";
		}
	};

	vm.addQuestionClick = function() {
		if(vm.questionContent) {
			vm.questionsToPresenter.$add({
				content: vm.questionContent,
				counter: 0,
				time: Firebase.ServerValue.TIMESTAMP
			});
		}
		vm.questionContent = "";
	};

	vm.removeQuestion = function(key) {
		vm.questionsToPresenter.$remove(key);
	};


	vm.voteQuestionUp = function(questionToPresenter) {
		questionToPresenter.counter++;
		QuestionsToPresenterService.questions.$save(questionToPresenter);
		console.log('questionToPresenter', questionToPresenter)
	};

	// vm.voteQuestionDown = function(questionToPresenter) {
	// 	questionToPresenter.counter--;
	// 	QuestionsToPresenterService.questions.$save(questionToPresenter);
	// };
}