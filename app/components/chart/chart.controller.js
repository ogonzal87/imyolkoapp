angular.module('Chart')
.controller('ResultsCtrl', ResultsCtrl);

function ResultsCtrl($scope, $interval, FIREBASE_URL, $firebaseArray, $firebaseObject) {

// create an end point in Firebase for the votes of the current user
  var currentLikeVotesRef = new Firebase(FIREBASE_URL + "/votes/likes");
// create an Array for all the vostes of the current user
  $scope.likeVotesArray = $firebaseArray(currentLikeVotesRef);
// create an end point in Firebase for the votes of the current user
  var currentDislikeVotesRef = new Firebase(FIREBASE_URL + "/votes/dislikes");
// create an Array for all the votes of the current user
  $scope.dislikeVotesArray = $firebaseArray(currentDislikeVotesRef);

// arrays that keep track of all the votes --> this arrays are populated each time the interval is triggered
  $scope.intervalLikeVotes = [];
  $scope.intervalDislikeVotes = [];
// initializing the dislike and like line arrays that will be used to populate the chart
  var likeLine = [];
  var dislikeLine = [];

// create a function that starts the Presentation and creates an interval
// for the snapshots I want to use to populale on the Chart with both a
// Like and a Dislike Lines.
  $scope.startPresentation = function() {
    var interval = $interval(function() {
      var numLikeVotes    = $scope.likeVotesArray.length;
      var numDislikeVotes = $scope.dislikeVotesArray.length;
      $scope.intervalLikeVotes.push(numLikeVotes);
      $scope.intervalDislikeVotes.push(numDislikeVotes);
      pushToLikeLineLineArr();
      pushToDislikeLineLineArr();
// interval duration is set to 1 minute by default
// TODO: need to establish a varibale so that the presented can dictate
// the interval themselves.
    }, 5000);
// Create a way to stop the Presetation and Intevals
    $scope.stopPresentation = function() {
      console.log("Called cancel interval");
      $interval.cancel(interval);
    };
  };
// functions that take the last 2 values of the interval arrays and
// substracts them to come up of the number of clicks by interval
// the product of this is pushed to the respective line arrays for display
  var pushToLikeLineLineArr = function () {
    var a = _.last($scope.intervalLikeVotes, [2]);
    var b = _.reduce(a, function(memo, num){
       return num - memo;
     }, 0);
    likeLine.push(b);
  };
  var pushToDislikeLineLineArr = function () {
    var a = _.last($scope.intervalDislikeVotes, [2]);
    var b = _.reduce(a, function(memo, num){
       return num - memo;
     }, 0);
    dislikeLine.push(b);
  };

// Only doing this to see the values on the PRE tag on the page
  $scope.likeLine = likeLine;
  $scope.dislikeLine = dislikeLine;

// Watch for events in the line arrays and dray the lines in the chart dinamically.
  $scope.$watch('likeLine', function(newVals, oldVals) {
    var allData = {
      // A labels array that can contain any sort of values
      labels: ['1min', '2min', '3min', '4min', '5min', '6min', '7min', '8min', '9min', '10min', '11min', '12min', '13min', '14min', '15min'],
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
    var options = {
      low: 0,
      axisY: {
        onlyInteger: true,
      },
      // width: 600,
      // height: 300,
      //Handle holes (if people did not have any votes in a certain minute) in data
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true,
      })
    };
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('.ct-chart', allData, options);
  }, true);
}
