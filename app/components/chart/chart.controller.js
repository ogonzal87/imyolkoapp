angular.module('YolkoApp')
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

// create a function that starts the Presentation and creates an interval
// for the snapshots I want to use to populale on the Chart with both a
// Like and a Dislike Lines.
  $scope.intervalLikeVotes = [];
  $scope.intervalDislikeVotes = [];
  var likeLine = [];
  var dislikeLine = [];

  $scope.startPresentation = function() {
    var interval = $interval(function() {
      var numLikeVotes    = $scope.likeVotesArray.length;
      var numDislikeVotes = $scope.dislikeVotesArray.length;
      $scope.intervalLikeVotes.push(numLikeVotes);
      $scope.intervalDislikeVotes.push(numDislikeVotes);
      pushToLikeLineLineArr();
      pushToDislikeLineLineArr();
    }, 60000);
// Create a wey to stop the Presetation and Intevals
    $scope.stopPresentation = function() {
      console.log("Called cancel interval");
      $interval.cancel(interval);
    };
  };

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

  $scope.$watch('likeLine', function(newVals, oldVals) {
    console.log(likeLine);
    console.log(oldVals);

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
