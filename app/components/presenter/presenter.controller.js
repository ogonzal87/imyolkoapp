angular.module('Presenter')
.controller('PresenterCtrl', PresenterCtrl);

function PresenterCtrl($scope, $interval, $timeout, VotesService, QuestionsService, DataAttendeeService, ResetService, QuizService, StopwatchService) {
	//LOAD ATTENDEES
	$scope.attendees                 = DataAttendeeService.attendees;
	// LOAD QUESTIONS
	$scope.allQuestionsFromAttendees = QuestionsService.questions;
	//LOAD VOTES
	$scope.votes                     = VotesService.votes;
	//LOAD LIKE VOTES
	$scope.likeVotesArray            = VotesService.likeVotesArray;
	//LOAD DISLIKE VOTES
	$scope.dislikeVotesArray         = VotesService.dislikeVotesArray;
	//LOAD QUIZ QUESTION OBJECT
	$scope.quizQuestion1             = QuizService.quizQuestion1;

	// bind the obj to the database in Firebase
	// any changes that happen in the view will be updated automatically in Firebase and viceversa
	QuizService.quizQuestion1.$bindTo($scope, 'quizQuestion1');

	// arrays that keep track of all the votes --> this arrays are populated each time the interval is triggered
	$scope.intervalLikeVotes    = [];
	$scope.intervalDislikeVotes = [];
	//initializing the dislike and like line arrays that will be used to populate the chart
	var likeLine = [];
	var dislikeLine = [];
	var chartLabels = [];

	//////////////////////////////////////////////////////////////////////////////////////
// STOPWATCH TODO: Need to syncronize the crart with the stopwatch a little bit better -> Stop Presentation should delete all the chart data and start from scratch
	//////////////////////////////////////////////////////////////////////////////////////
	var clsStopwatch = StopwatchService.clsStopwatch;
	var x = new clsStopwatch();
	var clocktimer;

	function pad(num, size) {
		var s = "0000" + num;
		return s.substr(s.length - size);
	}

	function formatTime(time) {
		var h = m = s = ms = 0;
		var newTime = '';

		h = Math.floor( time / (60 * 60 * 1000) );
		time = time % (60 * 60 * 1000);
		m = Math.floor( time / (60 * 1000) );
		time = time % (60 * 1000);
		s = Math.floor( time / 1000 );

		newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2)
		return newTime;
	}

	$scope.showStopwatch = function() {
		$scope.updateStopwatch();
	};

	$scope.updateStopwatch = function() {
		$scope.stopWatch = formatTime(x.time());
	};

	var startStopwatch = function() {
		clocktimer = $interval($scope.updateStopwatch, 1);
		x.start();
	};

	var stopStopwatch = function() {
		x.stop();
		clearInterval(clocktimer);
	};

	var resetStopWatch = function() {
		stopStopwatch();
		x.reset();
		$scope.updateStopwatch();
	};

	// create a function that starts the Presentation and creates an interval
	// for the snapshots I want to use to populale on the Chart with both a
	// Like and a Dislike Lines.
	var intervalChart;
  $scope.startPresentation = function() {

  	//logic to toggle active class for the Media btns
	  $scope.activePlayBtn = true;
	  $scope.activePauseBtn = false;
	  $scope.activeStopBtn = false;


    startStopwatch();
    intervalChart = $interval(function() {
	    $scope.tickInterval = 1000; //seconds
	    $scope.intervalLikeVotes.push($scope.likeVotesArray.length);
	    $scope.intervalDislikeVotes.push($scope.dislikeVotesArray.length);
	    pushToLikeLineLineArr();
	    pushToDislikeLineLineArr();
	    pushToChartLabelsArr(1);

	    // interval duration is set to 1 minute by default
	    // TODO: need to establish a variable so that the presented can dictate the interval themselves.
    }, 5000);

    // Create a way to stop the Presetation and Intevals
    // TODO: I need to take this stopPresetnation function out side on the Start Presentation function.
  };

  $scope.pausePresentation = function() {
	  //logic to toggle active class for the Media btns
	  $scope.activePlayBtn = false;
	  $scope.activePauseBtn = true;
	  $scope.activeStopBtn = false;

	  stopStopwatch();
	  $interval.cancel(intervalChart);
	  console.log("Paused the meeting");
  };

	$scope.stopPresentation = function() {
		//logic to toggle active class for the Media btns
		$scope.activePlayBtn = false;
		$scope.activePauseBtn = false;
		$scope.activeStopBtn = true;

		resetStopWatch();
		$interval.cancel(intervalChart);
		console.log("Stopped the meeting");
	};


	// functions that take the last 2 values of the interval arrays and
	// substracts them to come up of the number of clicks by interval
	// the product of this is pushed to the respective line arrays for display
	function pushToLikeLineLineArr() {
		var a = _.last($scope.intervalLikeVotes, [2]);
		var b = _.reduce(a, function(memo, num){
			return num - memo;
		}, 0);
		likeLine.push(b);
	}

	function pushToDislikeLineLineArr() {
		var a = _.last($scope.intervalDislikeVotes, [2]);
		var b = _.reduce(a, function(memo, num){
			return num - memo;
		}, 0);
		dislikeLine.push(b);
	}

	function pushToChartLabelsArr(num) {
		console.log(chartLabels);
		chartLabels.push(num);
		// console.log(chartLabels);
		return chartLabels
	}

	// Only doing this to see the values on the PRE tag on the page
	$scope.likeLine = likeLine;
	$scope.dislikeLine = dislikeLine;
	// Watch for events in the line arrays and dray the lines in the chart dinamically.
	$scope.$watch('likeLine', function(newVals, oldVals) {
		var chartAllData = {
			// A labels array that can contain any sort of values
			labels: chartLabels,
			// Series array that contains series objects or in this case series data arrays
			series: [
				{
					name: 'likes',
					data: likeLine
				},
				{
					name: 'dislikes',
					data: dislikeLine
				}
			]
		};

		// As options we currently only set a static size of 300x200 px. We can also omit this and use aspect ratio containers
		// as you saw in the previous example
		var chartLineOptions = {
			height: 300,
			// seriesBarDistance: 30,
			axisX: {

				// If labels should be shown or not
				showLabel: true,
				// If the axis grid should be drawn or not
				showGrid: true,
				// Use only integer values (whole numbers) for the scale steps
				onlyInteger: true
			},
			axisY: {
				onlyInteger: true
			},
			distributeSeries: false,
			stackMode: 'accumulate',
		};
		// Create a new line chart object where as first parameter we pass in a selector
		// that is resolving to our chart container element. The Second parameter
		// is the actual data object and the third the options.
		new Chartist.Bar('.ct-chart-timeline', chartAllData, chartLineOptions);
	}, true);





















	//+++++++++++++++++++++++++++++++++//FIREBASE WATCHING ALL EVENTS+++++++++++++++++++++++++++++++//
	$scope.$watch('attendees', function(newVal, oldVal) {
		$scope.numAttendees = $scope.attendees.length;

		//VOLUME
		// /////////////////////////////////////////////////////////////////////////
		var volumeUpAttendees = _.filter($scope.attendees, function(attendee) {
			return attendee.volumeUp == "yes";
		});
		$scope.volumeUpPercent = volume(Math.round((volumeUpAttendees.length / $scope.numAttendees) * 100));

		//SPEED
		///////////////////////////////////////////////////////////////////////////
		var speedValue = _.reduce($scope.attendees, function(memo, attendee) {
			return memo + attendee.speed;
		}, 0);
		$scope.speedPercent = speed(Math.round((speedValue / $scope.numAttendees) * 100));

		//LOST
		// /////////////////////////////////////////////////////////////////////////
		var lostValues = _.filter($scope.attendees, function(attendee) {
			return attendee.feeling == "panic";
		});
		$scope.panicPercent = panic(Math.round((lostValues.length / $scope.numAttendees) * 100));

		//DISLIKE PERCENTAGE
		// /////////////////////////////////////////////////////////////////////////
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

	//Displaying Yolko
	$scope.avatarDashboard = { face:'assets/icons/dash-great.svg', message: 'Yolko is great' };
	function displayYolkoInDashboard() {
		if($scope.dislikePercent >= 80) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-tense.svg', message: 'Yolko is a little tense', backgroundColor: 'lever-5-mood-color'};
		} else if ($scope.dislikePercent >= 60 && $scope.dislikePercent <= 79.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-notsogood.svg', message: 'Yolko is not so good', backgroundColor: 'lever-4-mood-color'};
		} else if ($scope.dislikePercent >= 40 && $scope.dislikePercent <= 59.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-serious.svg', message: 'Yolko is ok', backgroundColor: 'lever-3-mood-color'};
		} else if ($scope.dislikePercent >= 20 && $scope.dislikePercent <= 39.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-great.svg', message: 'Yolko is great', backgroundColor: ''};
		} else if ($scope.dislikePercent >= 0 && $scope.dislikePercent <= 29.999999999999) {
			return $scope.avatarDashboard = {face: 'assets/icons/dash-motivated.svg', message: 'Yolko is motivated!', backgroundColor: 'lever-1-mood-color'};
		} else {
			return $scope.avatarDashboard = { face:'assets/icons/dash-great.svg', message: 'Yolko is great', backgroundColor: '' };
		}
	}


	function volume(percent) {
		if (percent > 10) {
			return { value: percent, content: percent, class: 'dashboard-bad-color' };
		} else {
			return { value: percent, content: percent, class: '' };
		}
	}


	function speed(percent) {

		if (percent > 20) {
			return { value: percent, content: 'Go Faster', class: 'is-active-circle-too-fast' };
		} else if (percent < -20) {
			return { value: percent,  content: 'Go Slower', class: 'is-active-circle-too-slow' };
		} else {
			return { value: percent, content: "We are good", class: 'is-active-circle-we-good' };
		}
		//
		// if (percent > 20) {
		// 	return { value: percent, content: 'Go Way Faster', class: 'is-active-circle-too-fast' };
		// } else if (percent > 10) {
		// 	return { value: percent, content: 'Go Faster', class: 'is-active-circle-go-slower' };
		// } else if (percent < -20) {
		// 	return { value: percent,  content: 'Go way Slower', class: 'is-active-circle-too-slow' };
		// } else if (percent < -10) {
		// 	return { value: percent, content: 'Go Slower', class: 'is-active-circle-go-faster' };
		// } else {
		// 	return { value: percent, content: "We are good", class: 'is-active-circle-we-good' };
		// }

		// if (percent > 20) {
		// 	return { value: percent, content: 'Too Slow', class: 'is-active-circle-too-slow' };
		// } else if (percent > 10) {
		// 	return { value: percent, content: 'Go Faster', class: 'is-active-circle-go-faster' };
		// } else if (percent < -20) {
		// 	return { value: percent, content: 'Too Fast!', class: 'is-active-circle-too-fast' };
		// } else if (percent < -10) {
		// 	return { value: percent, content: 'Go Slower', class: 'is-active-circle-go-slower' };
		// } else {
		// 	return { value: percent, content: "We are good!", class: 'is-active-circle-we-good' };
		// }
	}

	function panic(percent) {
		if (percent > 25) {
			return { content: percent };
		} else {
			return { content: percent };
		}
	}

	// toggle tabs in dashboard
	// /////////////////////////////////////////////////////////////////////////
	$scope.tab1IsActive = false;
	$scope.tab2IsActive = false;
	$scope.toggleTabs = function(tab) {
		if (tab === 'tab1IsActive') {
			$scope.tab1IsActive = true;
			$scope.tab2IsActive = false;
		}
		if (tab === 'tab2IsActive' ) {
			$scope.tab2IsActive = true;
			$scope.tab1IsActive = false;
		}
	};


	//Quiz Maker
	// /////////////////////////////////////////////////////////////////////////
	$scope.isCorrectAnsA = false;
	$scope.isCorrectAnsB = false;
	$scope.isCorrectAnsC = false;
	$scope.isCorrectAnsD = false;
	$scope.showFireQuizBtn = true;
	$scope.fireQuizToAttendees = function() {
		var randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
		var questionData = {
			questionContent: $scope.popQuizQuestionContent,
			availableAns: [
				{
					value: 'a',
					content: $scope.choiceA,
					isCorrectAns: $scope.isCorrectAnsA
				},
				{
					value: 'b',
					content: $scope.choiceB,
					isCorrectAns: $scope.isCorrectAnsB
				},
				{
					value: 'c',
					content: $scope.choiceC,
					isCorrectAns: $scope.isCorrectAnsC
				},
				{
					value: 'd',
					content: $scope.choiceD,
					isCorrectAns: $scope.isCorrectAnsD
				}
			],
			key: randomKey,
			// Make the Pop Quiz show on the Meeting Page UI
			// TODO: this is not the best approach. Need to come up with a better one.
			isShowingQuiz: true,
			isShowingResultsToAttendees: false,
			isShowingResultsToPresenter: true,
		};

		//show 'Reveal Quiz Results' btn
		$scope.showRevealResultsBtn = true;
		//hide 'Submit Quiz' btn
		$scope.showFireQuizBtn = false;
		// Figure out which is thw correct answer from the data in Firebase and store in a variable
		questionData.correctAns =  _.findWhere(questionData.availableAns, {isCorrectAns: true});
		// Set the question in Firebase
		QuizService.quizQuestion1Url.set(questionData);
	};

	// Results
	// /////////////////////////////////////////////////////////////////////////
	$scope.$watch('quizQuestion1', function(newVals, oldVals) {
		$scope.numOfAnswersFromAttendees = QuizService.quizAnswers1A.length + QuizService.quizAnswers1B.length + QuizService.quizAnswers1C.length + QuizService.quizAnswers1D.length;

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
			},
			width: 900,
			height: 400,
		};

		// Create a new bar chart object where as first parameter we pass in a selector
		// that is resolving to our chart container element. The Second parameter
		// is the actual data object and the third the options.
		new Chartist.Bar('.ct-chart-quiz', chartAllData, chartBarOptions);

		//Shows the quiz on the UI of the attendee when the Pop Qui is fired from the Dashboard
		$scope.showQuiz = $scope.quizQuestion1.isShowingQuiz;
		//Shows the quiz on the UI of the attendee when the Pop Qui is fired from the Dashboard
		$scope.isShowingResultsToPresenter = $scope.quizQuestion1.isShowingResultsToPresenter;
	}, true);


	//RESET
	// /////////////////////////////////////////////////////////////////////////

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
