angular.module('Presenter')
.controller('PresenterCtrl', PresenterCtrl);

function PresenterCtrl($scope, $interval, VotesService, QuestionsService, DataAttendeeService) {

// LOAD ATTENDEES
  $scope.attendees = DataAttendeeService.attendees;
// LOAD QUESTIONS
  $scope.questions = QuestionsService.questions;
// LOAD VOTES
  $scope.votes = VotesService.votes;
// LOAD LIKE VOTES
  $scope.likeVotesArray = VotesService.allLikeVotesApiUrl;
// LOAD DISLIKE VOTES
  $scope.dislikeVotesArray = VotesService.allDislikeVotesApiUrl;

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
      console.log(numLikeVotes);
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
    console.log('pushed to like');
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



//+++++++++++++++++++++++++++++++++//FIREBASE WATCHING ALL EVENTS+++++++++++++++++++++++++++++++//
  $scope.$watch('attendees', function(newVal, oldVal) {
    $scope.numAttendees = $scope.attendees.length;

  //VOTES
  ///////////////////////////////////////////////////////////////////////////
    // var dislikeVotesAttendees = _.filter($scope.attendees, function(attendee) {
    //   return attendee.vote == "dislike";
    // });
    // $scope.dislikeVotesAttendees = dislikeVotesAttendees.length;
    // $scope.dislikePercent = Math.round((dislikeVotesAttendees.length / $scope.numAttendees) * 100);
  //VOTES END
  ///////////////////////////////////////////////////////////////////////////

  //VOLUME
  ///////////////////////////////////////////////////////////////////////////
    var volumeUpAttendees = _.filter($scope.attendees, function(attendee) {
      return attendee.volumeUp == "yes";
    });
    $scope.volumeUpAttendees = volumeUpAttendees.length;
    $scope.volumeUpPercent = volume(Math.round((volumeUpAttendees.length / $scope.numAttendees) * 100));
  //VOLUME END
  ///////////////////////////////////////////////////////////////////////////


  //SPEED
  ///////////////////////////////////////////////////////////////////////////
    $scope.speedValue = _.reduce($scope.attendees, function(memo, attendee) {
      return memo + attendee.speed;
    }, 0);
    $scope.speedPercent = speed(Math.round(($scope.speedValue / $scope.numAttendees) * 100));
  //SPEED END
  ///////////////////////////////////////////////////////////////////////////

  //FEELING
  ///////////////////////////////////////////////////////////////////////////
    var feelingValues = _.filter($scope.attendees, function(attendee) {
      return attendee.feeling == "panic";
    });
    $scope.feelingValues = feelingValues.length;
    $scope.panicPercent = panic(Math.round((feelingValues.length / $scope.numAttendees) * 100));
  //FEELING END
  ///////////////////////////////////////////////////////////////////////////

  //QUESTIONS
  ///////////////////////////////////////////////////////////////////////////
  // Create a watch to watch othe what happens on the Attendees node
    $scope.allQuestionsFromAttendees = [];
    _.each($scope.attendees, function(attendee) {
      _.each(attendee.questions, function(question) {
        $scope.allQuestionsFromAttendees.push({
          content: question.content,
          name: attendee.name
        });
      });
    });
  //QUESTIONS END
  ////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  }, true);


  function volume(percent) {
    if (percent > 10) {
      return { value: percent, content: percent, class: 'panel-dashboard-bad' };
    } else {
      return { value: percent, content: percent, class: 'panel' };
    }
  }

  function speed(percent) {
    if (percent > 20) {
      return { value: percent, content: 'Too Slow!', class: 'panel-dashboard-bad' };
      } else if (percent > 10) {
        return { value: percent, content: 'Go Faster', class: 'panel-dashboard-middle' };
      } else if (percent < -20) {
        return { value: percent, content: 'Too Fast!', class: 'panel-dashboard-bad' };
      } else if (percent < -10) {
        return { value: percent, content: 'Go Slower', class: 'panel-dashboard-middle' };
      } else {
        return { value: percent, content: 'Just Fine', class: 'panel' };
      }
    }

    function panic(percent) {
      if (percent > 25) {
        return { content: percent, class: 'panel-dashboard-bad' };
      } else {
        return { content: percent, class: 'panel' };
      }
    }

// ============================ RESET ================================


  $scope.resetVolumeTraceker = function() {
    _.each($scope.attendees, function(attendee) {
      attendee.volumeUp = 'no';
      $scope.attendees.$save(attendee);
    });
  };

  $scope.resetSpeedTracker = function() {
    _.each($scope.attendees, function(attendee) {
      attendee.speed = 0;
      $scope.attendees.$save(attendee);
    });
  };

  $scope.resetYolko = function() {
    _.each($scope.attendees, function(attendee) {
      attendee.vote = 'like';
      $scope.attendees.$save(attendee);
    });
  };

  $scope.resetPanicTracker = function() {
    _.each($scope.attendees, function(attendee) {
      attendee.feeling = 'fine';
      $scope.attendees.$save(attendee);
    });
  };

 $scope.resetEverything = function() {
    _.each($scope.attendees, function(attendee) {
      attendee.feeling = 'fine';
      attendee.speed = 0;
      attendee.volumeUp = 0;
      attendee.vote = 'like';
      $scope.attendees.$save(attendee);
      var refArrayQuestions = new Firebase(FIREBASE_URL + '/attendees/' + attendee.key + '/questions');
      refArrayQuestions.remove();
    });
  };

  $scope.deleteEverything = function() {
   refArrayAllAttendees.remove();
  };

}
