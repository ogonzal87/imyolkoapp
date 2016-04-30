angular.module('Presenter')
.service('ResetService', ResetService);

function ResetService(DataAttendeeService) {

    var resetVolumeTraceker = function() {
      _.each(DataAttendeeService.attendees, function(attendee) {
        attendee.volumeUp = 'no';
        DataAttendeeService.attendees.$save(attendee);
      });
    };

    var resetSpeedTracker = function() {
      _.each(DataAttendeeService.attendees, function(attendee) {
        attendee.speed = 0;
        DataAttendeeService.attendees.$save(attendee);
      });
    };

    var resetYolko = function() {
      _.each(DataAttendeeService.attendees, function(attendee) {
        attendee.vote = 'like';
        DataAttendeeService.attendees.$save(attendee);
      });
    };

    var resetPanicTracker = function() {
      _.each(DataAttendeeService.attendees, function(attendee) {
        attendee.feeling = 'fine';
        DataAttendeeService.attendees.$save(attendee);
      });
    };

    var resetEverything = function() {
      _.each(DataAttendeeService.attendees, function(attendee) {
        attendee.feeling = 'fine';
        attendee.speed = 0;
        attendee.volumeUp = 0;
        attendee.vote = 'like';
        DataAttendeeService.attendees.$save(attendee);
        QuestionsService.questions.remove();
      });
    };

    var deleteEverything = function() {
     DataAttendeeService.attendees.remove();
    };

  return {
    resetVolumeTraceker: resetVolumeTraceker,
    resetSpeedTracker:   resetSpeedTracker,
    resetYolko:          resetYolko,
    resetPanicTracker:   resetPanicTracker,
    resetEverything:     resetEverything,
    deleteEverything:    deleteEverything
  };
}
