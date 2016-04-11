angular
.module('YolkoApp', [
  "firebase",
  "ui.router"
])
.constant('FIREBASE_URL', 'https://yolkoapp.firebaseio.com')
.config(ApplicationConfig);


function ApplicationConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('landingPage', {
  		url: '/',
  		templateUrl: 'views/landing-page/landing-page.html',
      controller: 'AttendeeCtrl'
  	})
    .state('results', {
      url: '/results',
      templateUrl: 'views/results-page/results-page.html',
      controller: 'ResultsCtrl'
    });

  $urlRouterProvider.otherwise('/');
}



angular.module('YolkoApp')
.controller("AttendeeCtrl", function(FIREBASE_URL, $firebaseObject, $firebaseArray, $scope, $timeout) {

//
// TODO: PUT ALL OF THIS IN A SERVICE OR FACTORY
// ********************

// create a unique key for each attendee that comes in
  var randomKey            = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
// create an end point in Firebase for all attendees (root of attendees)
  var allAttendeesRefArray = new Firebase(FIREBASE_URL + "/attendees");
// create an Array with all the attendees in the database with theis keys
  $scope.attendees         = $firebaseArray(allAttendeesRefArray);


// create an Attendee object that will be automatically constructed on page load with defaulted attribites
  var defaultAttendee = {
    feeling: 'fine',
    speed: 0,
    volumeUp: 'no',
    key: randomKey,
    startedAt: Firebase.ServerValue.TIMESTAMP
  };

// create an end point in Firebase for the user loaded
  var currentAttendeeRef     = new Firebase(FIREBASE_URL + "/attendees/" + defaultAttendee.key);
// create an Object for the current attendee on the session
  var currentAttendeeSyncObj = $firebaseObject(currentAttendeeRef);
// create the attendee on page arrival - Push the user to the database and start the session
  currentAttendeeRef.set(defaultAttendee);

// bind the obj to the database in Firebase
// any chnages that happen in the view will be updated automaticaly in Firebase and viseversa
  currentAttendeeSyncObj.$bindTo($scope, 'attendee');

//
// TODO: PUT ALL OF THIS IN A SERVICE OR FACTORY
// ********************




//Votes ____________________________________________________________________________________________________________________________________

// create an end point in Firebase for all attendees (root of attendees)
  var votesRefArray = new Firebase(FIREBASE_URL + "/votes");
// create an Array with all the attendees in the database with theis keys
  $scope.votes         = $firebaseArray(votesRefArray);

// create an end point in Firebase for the votes of the current user
  var currentLikeVotesRef = new Firebase(FIREBASE_URL + "/votes/likes");
// create an Array for all the vostes of the current user
  $scope.likeVotesArray = $firebaseArray(currentLikeVotesRef);

// Create a function that when is clicked creates a LIKE vote Object in Firebase this is stored in an array
  $scope.voteLike = function() {
    $scope.attendee.vote = 'like';
    $scope.likeVotesArray.$add({
      user: defaultAttendee.key,
      name: 'like',
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

// create an end point in Firebase for the votes of the current user
  var currentDislikeVotesRef = new Firebase(FIREBASE_URL + "/votes/dislikes");
// create an Array for all the votes of the current user
  $scope.dislikeVotesArray = $firebaseArray(currentDislikeVotesRef);

// Create a function that when is clicked creates a DISLIKE vote Object in Firebase this is stored in an array
  $scope.voteDislike = function() {
    $scope.attendee.vote = 'dislike';
    $scope.dislikeVotesArray.$add({
      user: defaultAttendee.key,
      name: 'dislike',
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


//_______________________________________________________________________________________________________________________________________________



// Create a watch to watch othe what happens on the Attendees node
  $scope.$watch('attendees', function(newVal, oldVal) {

  }, true);


// Create a watch to watch othe what happens on the Votes node
  $scope.$watch('votes', function(newVal, oldVal) {
    var numVotes = ($scope.likeVotesArray.length + $scope.dislikeVotesArray.length);
    var numDislikeVotes = $scope.dislikeVotesArray.length;

    //console.log('Total # of votes: ' + numVotes);
    //console.log('Total # of dislike votes: ' + numDislikeVotes);

    $scope.dislikePercent = Math.round((numDislikeVotes / numVotes) * 100);
  }, true);






















});
