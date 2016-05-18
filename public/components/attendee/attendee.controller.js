angular.module('Attendee')
.controller("AttendeeCtrl", AttendeeCtrl);

function AttendeeCtrl($scope, $timeout, DataAttendeeService, VotesService, QuestionsService, QuizService) {

// LOAD ATTENDEES
  $scope.attendees = DataAttendeeService.attendees;
// LOAD QUESTIONS
  $scope.questions = QuestionsService.questions;
// LOAD VOTES
  $scope.votes = VotesService.votes;
// LOAD LIKE VOTES
  $scope.likeVotesArray = VotesService.likeVotesArray;
// LOAD DISLIKE VOTES
  $scope.dislikeVotesArray = VotesService.dislikeVotesArray;
  //LOAD QUIZ QUESTIONS
  $scope.quizQuestion1 = QuizService.quizQuestion1;
  $scope.quizQuestion2 = QuizService.quizQuestion2;
  $scope.quizQuestion3 = QuizService.quizQuestion3;

// bind the obj to the database in Firebase
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
      user: DataAttendeeService.defaultAttendee.key,
      vote: 'like',
      value: 1,
      timestamp: Firebase.ServerValue.TIMESTAMP
    });
// I have to disable to btn so people so not submit more than 1 vote per
// interval
    // $scope.disableLikeBtn = true;
    // $timeout(function() {
    //   $scope.disableLikeBtn = false;
    // }, 1000);
  };
// Create a function that when is clicked creates a DISLIKE vote Object in Firebase this is stored in an array
  $scope.voteDislike = function() {
    $scope.attendee.vote = 'dislike';
    $scope.dislikeVotesArray.$add({
      user: DataAttendeeService.defaultAttendee.key,
      vote: 'dislike',
      value: 0,
      timestamp: Firebase.ServerValue.TIMESTAMP
    });
// I have to disable to btn so people so not submit more than 1 vote per
// interval
    // $scope.disableDislikeBtn = true;
    // $timeout(function() {
    //   $scope.disableDislikeBtn = false;
    // }, 1000);
  };


//QUIZ
/////////////////////////////////////////////////////////////////////////
  $scope.submitAnswer = function () {
    if ($scope.chosenAnswer === "A") {
      QuizService.quizAnswers1A.$add(1);
    } else if ($scope.chosenAnswer === "B") {
      QuizService.quizAnswers1B.$add(1);
    } else if ($scope.chosenAnswer === "C") {
      QuizService.quizAnswers1C.$add(1);
    }
  };


  $scope.$watch('quizQuestion1', function(newVals, oldVals) {
    // var quizChart = QuizChartService.chart;
    var answersA = QuizService.quizAnswers1A.length;
    var answersB = QuizService.quizAnswers1B.length;
    var answersC = QuizService.quizAnswers1C.length;

    console.log("answersA", answersA);
    console.log("answersB", answersB);
    console.log("answersC", answersC);


    new Chartist.Bar('.ct-chart', {
      labels: ['A', 'B', 'C'],
      series: [answersA, answersB, answersC]
    }, {
      distributeSeries: true
    });

  }, true);











//QUESTIONS TO THE PRESENTER
/////////////////////////////////////////////////////////////////////////
  $scope.addQuestionKeyDown = function(event) {
    if (event.keyCode === 13 && $scope.questionContent) {
      $scope.questions.$add({
        content: $scope.questionContent
      });
      $scope.questionContent = "";
    }
  };//questions

  $scope.addQuestionClick = function() {
     $scope.questions.$add({
       content: $scope.questionContent
     });
     $scope.questionContent = "";
   };//questions

   $scope.removeQuestion = function(key) {
    $scope.questions.$remove(key);
  };


//WATCHING ATTENDEE OBJECT
/////////////////////////////////////////////////////////////////////////
// Create a watch to watch what happens on the Attendees node
  $scope.$watch('attendees', function(newVal, oldVal) {
    $scope.allQuestionsFromAttendees = [];
    _.each($scope.attendees, function(attendee) {
      _.each(attendee.questions, function(question) {
        $scope.allQuestionsFromAttendees.push({
          content: question.content
        });
      });
    });

    // Panic Button Logic
  $scope.panicButton = function(attendee) {
    if ($scope.attendee.feeling == "fine") {
      $scope.attendee.feeling = "panic";
    } else if ($scope.attendee.feeling == "panic") {
      $scope.attendee.feeling = "fine";
    }
   };// Panic Button Logic

   displayYolko();
  }, true);



//TODO: I need to come up with better math here...
// Create a watch to watch what happens on the Votes node
  $scope.$watch('votes', function(newVal, oldVal) {
    var numVotes = ($scope.likeVotesArray.length + $scope.dislikeVotesArray.length);
    var numDislikeVotes = $scope.dislikeVotesArray.length;

    //console.log('Total # of votes: ' + numVotes);
    //console.log('Total # of dislike votes: ' + numDislikeVotes);

    $scope.dislikePercent = Math.round((numDislikeVotes / $scope.attendees.length) * 100);
  }, true);


  //Displaying Yolko
  function displayYolko() {
    $scope.burnt              = $scope.dislikePercent >= 76;
    $scope.shocked            = $scope.dislikePercent >= 64 && $scope.dislikePercent <= 75.999999999999;
    $scope.idontgetit         = $scope.dislikePercent >= 56 && $scope.dislikePercent <= 63.999999999999;
    $scope.startingtonotgetit = $scope.dislikePercent >= 48 && $scope.dislikePercent <= 55.999999999999;
    $scope.tastey             = $scope.dislikePercent >= 40 && $scope.dislikePercent <= 47.999999999999;
    $scope.want               = $scope.dislikePercent >= 32 && $scope.dislikePercent <= 39.999999999999;
    $scope.confident          = $scope.dislikePercent >= 24 && $scope.dislikePercent <= 31.999999999999;
    $scope.igotthis           = $scope.dislikePercent >= 16 && $scope.dislikePercent <= 23.999999999999;
    $scope.badass             = $scope.dislikePercent >= 8 && $scope.dislikePercent <= 15.999999999999;
    $scope.zzz                = $scope.dislikePercent < 7.999999999999 || null;
  }

}
